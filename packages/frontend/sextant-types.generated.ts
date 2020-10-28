

export type EventType<T, K> = { type: K } & T;

export interface SextantServices {
  'yourFirstService': {
    environments: {
      'wdawdawd': {
        from: {
        }
        to: {
        }
      }
    }
  }
}

export interface EventConfig {
  in: { type: string };
  out: { type: string };
}

type SextantPromise<TEventConfig extends EventConfig> = (
  event: TEventConfig["in"],
) => Promise<TEventConfig["out"]> | TEventConfig["out"];

/**
 * A handler type built by Sextant.
 *
 * Usage:
 *
 * ```ts
 * const handler: SextantHandler<
 *   'serviceName',
 *   'fromThisEnvironment',
 *   'toThisEnvironment',
 * > = () => {};
 * ```
 */
export type SextantHandler<
  IService extends keyof SextantServices,
  IFrom extends keyof SextantServices[IService]["environments"] = any,
  // @ts-ignore
  ITarget extends keyof SextantServices[IService]["environments"][IFrom]["from"] = any
> = SextantPromise<
  // @ts-ignore
  SextantServices[IService]["environments"][IFrom]["to"][ITarget]
>;

/**
 * An event type built by Sextant.
 *
 * Usage:
 *
 * ```ts
 * const event: SextantEvent<'serviceName', 'fromThisEnvironment', 'toThisEnvironment'>;
 * const specificEvent: SextantEvent<
 *   'serviceName',
 *   'fromThisEnvironment',
 *   'toThisEnvironment',
 *   'SPECIFIC_EVENT_TYPE'
 * >;
 * ```
 */
export type SextantEvent<
  IService extends keyof SextantServices,
  IFrom extends keyof SextantServices[IService]["environments"] = any,
  // @ts-ignore
  ITarget extends keyof SextantServices[IService]["environments"][IFrom]["from"] = any,
  // @ts-ignore
  IType extends SextantServices[IService]["environments"][IFrom]["to"][ITarget]["in"]["type"] = any
> = Extract<
  // @ts-ignore
  SextantServices[IService]["environments"][IFrom]["to"][ITarget]["in"],
  { type: IType }
>;

