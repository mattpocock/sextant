import {
  getNamedType,
  getNullableType,
  GraphQLFieldResolver,
  GraphQLList,
  GraphQLNullableType,
  GraphQLResolveInfo,
  GraphQLSchema,
  GraphQLType,
  isAbstractType,
  isEnumType,
  isListType,
  isObjectType,
} from 'graphql';
import { v4 as uuidv4 } from 'uuid';

export type IMockTypeFn = (
  type: GraphQLType,
  typeName?: string,
  fieldName?: string,
) => GraphQLFieldResolver<any, any>;

export type IMockFn = GraphQLFieldResolver<any, any>;

const defaultMockMap: Map<string, IMockFn> = new Map();
defaultMockMap.set('Int', () => Math.round(Math.random() * 200) - 100);
defaultMockMap.set('Float', () => Math.random() * 200 - 100);
defaultMockMap.set('String', () => 'Hello World');
defaultMockMap.set('Boolean', () => Math.random() > 0.5);
defaultMockMap.set('ID', () => uuidv4());

export interface IMockOptions {
  /**
   * The schema to which to add mocks. This can also be a set of type definitions instead.
   */
  schema?: GraphQLSchema;
  /**
   * The mocks to add to the schema.
   */
  mocks?: Record<string, IMockFn>;
  /**
   * Set to `true` to prevent existing resolvers from being overwritten to provide
   * mock data. This can be used to mock some parts of the server and not others.
   */
  preserveResolvers?: boolean;
}

export const mockSchema = (
  schema: GraphQLSchema,
  mocks: IMockOptions['mocks'] = {},
) => {
  function mockType(
    type: GraphQLType,
    _typeName?: string,
    fieldName?: string,
  ): GraphQLFieldResolver<any, any> {
    const mockFunctionMap: Map<string, IMockFn> = new Map();
    Object.keys(mocks).forEach((typeName) => {
      mockFunctionMap.set(typeName, mocks[typeName]);
    });

    mockFunctionMap.forEach((mockFunction, mockTypeName) => {
      if (typeof mockFunction !== 'function') {
        throw new Error(`mockFunctionMap[${mockTypeName}] must be a function`);
      }
    });
    // order of precendence for mocking:
    // 1. if the object passed in already has fieldName, just use that
    // --> if it's a function, that becomes your resolver
    // --> if it's a value, the mock resolver will return that
    // 2. if the nullableType is a list, recurse
    // 2. if there's a mock defined for this typeName, that will be used
    // 3. if there's no mock defined, use the default mocks for this type
    return (
      root: any,
      args: Record<string, any>,
      context: any,
      info: GraphQLResolveInfo,
    ): any => {
      // nullability doesn't matter for the purpose of mocking.
      const fieldType = getNullableType(type) as GraphQLNullableType;

      const namedFieldType = getNamedType(fieldType);

      if (fieldName && root && typeof root[fieldName] !== 'undefined') {
        let result: any;

        // if we're here, the field is already defined
        if (typeof root[fieldName] === 'function') {
          result = root[fieldName](args, context, info);
          if (isMockList(result)) {
            result = result.mock(
              root,
              args,
              context,
              info,
              fieldType as GraphQLList<any>,
              mockType,
            );
          }
        } else {
          result = root[fieldName];
        }

        // Now we merge the result with the default mock for this type.
        // This allows overriding defaults while writing very little code.
        if (mockFunctionMap.has(namedFieldType.name)) {
          const mock = mockFunctionMap.get(namedFieldType.name);

          result = mergeMocks(
            mock?.bind(null, root, args, context, info),
            result,
          );
        }
        return result;
      }

      if (isListType(fieldType)) {
        return [
          mockType(fieldType.ofType)(root, args, context, info),
          mockType(fieldType.ofType)(root, args, context, info),
        ];
      }
      if (mockFunctionMap.has(fieldType.name) && !isAbstractType(fieldType)) {
        // the object passed doesn't have this field, so we apply the default mock
        const mock = mockFunctionMap.get(fieldType.name);
        return mock?.(root, args, context, info);
      }
      if (isObjectType(fieldType)) {
        // objects don't return actual data, we only need to mock scalars!
        const fields = fieldType.getFields();

        const toReturn = {};
        Object.entries(fields).forEach(([key, field]) => {
          toReturn[key] = mockType(field.type)(root, args, context, info);
        });
        return toReturn;
      }
      // if a mock function is provided for unionType or interfaceType, execute it to resolve the concrete type
      // otherwise randomly pick a type from all implementation types
      if (isAbstractType(fieldType)) {
        let implementationType;
        let interfaceMockObj: any = {};
        if (mockFunctionMap.has(fieldType.name)) {
          const mock = mockFunctionMap.get(fieldType.name);
          interfaceMockObj = mock?.(root, args, context, info);
          if (!interfaceMockObj || !interfaceMockObj.__typename) {
            return Error(`Please return a __typename in "${fieldType.name}"`);
          }
          implementationType = schema.getType(interfaceMockObj.__typename);
        } else {
          const possibleTypes = schema.getPossibleTypes(fieldType);
          implementationType = getRandomElement(possibleTypes);
        }
        return {
          __typename: implementationType,
          ...interfaceMockObj,
          ...mockType(implementationType)(root, args, context, info),
        };
      }

      if (isEnumType(fieldType)) {
        return getRandomElement(fieldType.getValues()).value;
      }

      if (defaultMockMap.has(fieldType.name)) {
        const defaultMock = defaultMockMap.get(fieldType.name);
        return defaultMock?.(root, args, context, info);
      }

      // if we get to here, we don't have a value, and we don't have a mock for this type,
      // we could return undefined, but that would be hard to debug, so we throw instead.
      // however, we returning it instead of throwing it, so preserveResolvers can handle the failures.
      return Error(`No mock defined for type "${fieldType.name}"`);
    };
  }
  return mockType;
};

function isObject(thing: any) {
  return thing === Object(thing) && !Array.isArray(thing);
}

// returns a random element from that ary
function getRandomElement(ary: ReadonlyArray<any>) {
  const sample = Math.floor(Math.random() * ary.length);
  return ary[sample];
}

function mergeObjects(a: Record<string, any>, b: Record<string, any>) {
  return Object.assign(a, b);
}

// takes either an object or a (possibly nested) array
// and completes the customMock object with any fields
// defined on genericMock
// only merges objects or arrays. Scalars are returned as is
function mergeMocks(genericMockFunction: () => any, customMock: any): any {
  if (Array.isArray(customMock)) {
    return customMock.map((el: any) => mergeMocks(genericMockFunction, el));
  }
  if (customMock instanceof Promise) {
    return customMock.then((res: any) =>
      mergeObjects(genericMockFunction(), res),
    );
  }
  if (isObject(customMock)) {
    return mergeObjects(genericMockFunction(), customMock);
  }
  return customMock;
}

/**
 * @internal
 */
export function isMockList(obj: any): obj is MockList {
  if (
    typeof obj?.len === 'number' ||
    (Array.isArray(obj?.len) && typeof obj?.len[0] === 'number')
  ) {
    if (
      typeof obj.wrappedFunction === 'undefined' ||
      typeof obj.wrappedFunction === 'function'
    ) {
      return true;
    }
  }

  return false;
}

/**
 * This is an object you can return from your mock resolvers which calls the
 * provided `mockFunction` once for each list item.
 */
export class MockList {
  private readonly len: number | Array<number>;
  private readonly wrappedFunction: GraphQLFieldResolver<any, any> | undefined;

  /**
   * @param length Either the exact length of items to return or an inclusive
   * range of possible lengths.
   * @param mockFunction The function to call for each item in the list to
   * resolve it. It can return another MockList or a value.
   */
  constructor(
    length: number | Array<number>,
    mockFunction?: GraphQLFieldResolver<any, any>,
  ) {
    this.len = length;
    if (typeof mockFunction !== 'undefined') {
      if (typeof mockFunction !== 'function') {
        throw new Error(
          'Second argument to MockList must be a function or undefined',
        );
      }
      this.wrappedFunction = mockFunction;
    }
  }

  /**
   * @internal
   */
  public mock(
    root: any,
    args: Record<string, any>,
    context: any,
    info: GraphQLResolveInfo,
    fieldType: GraphQLList<any>,
    mockTypeFunc: IMockTypeFn,
  ) {
    let arr: Array<any>;
    if (Array.isArray(this.len)) {
      arr = new Array(this.randint(this.len[0], this.len[1]));
    } else {
      arr = new Array(this.len);
    }

    for (let i = 0; i < arr.length; i++) {
      if (typeof this.wrappedFunction === 'function') {
        const res = this.wrappedFunction(root, args, context, info);
        if (isMockList(res)) {
          const nullableType = getNullableType(fieldType.ofType) as GraphQLList<
            any
          >;
          arr[i] = res.mock(
            root,
            args,
            context,
            info,
            nullableType,
            mockTypeFunc,
          );
        } else {
          arr[i] = res;
        }
      } else {
        arr[i] = mockTypeFunc(fieldType.ofType)(root, args, context, info);
      }
    }
    return arr;
  }

  private randint(low: number, high: number): number {
    return Math.floor(Math.random() * (high - low + 1) + low);
  }
}
