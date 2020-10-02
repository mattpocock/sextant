

export type EnvironmentName = 
  | "database"
  | "frontend"

export const createEnvironment = <Name extends EnvironmentName>(
  name: Name,
): Environment<Name> => {
  return {} as any;
};

export type Event =
    | { type: 'GET_USER' }
    | { type: 'USER' }
    | { type: 'NO_USER_FOUND' }
    | { type: 'UNKNOWN_ERROR' }

type EventsWithType<T extends Event['type']> = Extract<Event, { type: T }>;

type ServiceData = {
  'getUser': {
    environments:
    | 'database'
    | 'frontend'
    sendable: Extract<
      Event,
      {
        type:
          | 'USER'
          | 'NO_USER_FOUND'
      }
    >
    receivable: Extract<
      Event,
      {
        type:
          | 'GET_USER'
      }
    >
  };
};

type ServicesByName<Name> = {
  [K in keyof ServiceData]: Name extends ServiceData[K]['environments']
    ? K
    : never;
}[keyof ServiceData];

interface Environment<Name extends EnvironmentName> {
  createService<T extends ServicesByName<Name>>(
    name: T,
    adapter: (
      event: ServiceData[T]['receivable'],
      callback: (
        event: ServiceData[T]['sendable'] | EventsWithType<'UNKNOWN_ERROR'>,
      ) => void,
    ) => void,
  ): (
    event: ServiceData[T]['receivable'],
    callback: (
      event: ServiceData[T]['sendable'] | EventsWithType<'UNKNOWN_ERROR'>,
    ) => void,
  ) => void;
}

