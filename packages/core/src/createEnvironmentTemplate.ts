export const createEnvironmentTemplate = `

export type EnvironmentName = 
  {{#each environments}}
  | "{{this.id}}"
  {{/each}}

export const createEnvironment = <Name extends EnvironmentName>(
  name: Name,
): Environment<Name> => {
  return {} as any;
};

export type Event =
  {{#each events}}
    | { type: '{{ this.id }}' }
  {{/each}}
    | { type: 'UNKNOWN_ERROR' }

type EventsWithType<T extends Event['type']> = Extract<Event, { type: T }>;

type ServiceData = {
  {{#each services}}
  '{{this.id}}': {
    environments:
    | '{{this.to}}'
    | '{{this.from}}'
    sendable: Extract<
      Event,
      {
        type:
          {{#each this.sendableEvents}}
          | '{{this}}'
          {{/each}}
      }
    >
    receivable: Extract<
      Event,
      {
        type:
          {{#each this.receivableEvents}}
          | '{{this}}'
          {{/each}}
      }
    >
  };
  {{/each}}
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
`;
