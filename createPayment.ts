interface FromToConfig<From, To> {
  from: From;
  to: To;
}

interface Services {
  beneficiaryQueries: {
    environments: {
      frontend: FromToConfig<
        {
          lambda: { type: "BENEFICIARIES" } | { type: "BENEFICIARY" };
        },
        {
          lambda: { type: "GET_BENEFICIARIES" } | { type: "GET_BENEFICIARY" };
        }
      >;
      lambda: FromToConfig<
        {
          frontend: { type: "GET_BENEFICIARIES" } | { type: "GET_BENEFICIARY" };
          tcc: { type: "BENEFICIARIES" } | { type: "BENEFICIARY" };
        },
        {
          frontend: { type: "BENEFICIARIES" } | { type: "BENEFICIARY" };
          tcc: { type: "GET_BENEFICIARIES" } | { type: "GET_BENEFICIARY" };
        }
      >;
      tcc: FromToConfig<
        {
          lambda: { type: "GET_BENEFICIARIES" } | { type: "GET_BENEFICIARY" };
        },
        {
          lambda: { type: "BENEFICIARIES" } | { type: "BENEFICIARY" };
        }
      >;
    };
  };
  createBeneficiary: {
    environments: {
      frontend: FromToConfig<
        {
          lambda: { type: "BENEFICIARY" };
        },
        {
          lambda: { type: "CREATE_BENEFICIARY" };
        }
      >;
      lambda: FromToConfig<
        {
          frontend: { type: "CREATE_BENEFICIARY" };
          tcc: { type: "BENEFICIARY" };
        },
        {
          frontend: { type: "BENEFICIARY" };
          tcc: { type: "CREATE_BENEFICIARY" };
        }
      >;
      tcc: FromToConfig<
        {
          lambda: { type: "CREATE_BENEFICIARY" };
        },
        {
          lambda: { type: "BENEFICIARY" };
        }
      >;
    };
  };
  editBeneficiary: {
    environments: {
      frontend: FromToConfig<
        {
          lambda: { type: "BENEFICIARY" } | { type: "NO_PERMISSION" };
        },
        {
          lambda: { type: "EDIT_BENEFICIARY" } | { type: "EDIT_BENEFICIARY" };
        }
      >;
      lambda: FromToConfig<
        {
          frontend: { type: "EDIT_BENEFICIARY" } | { type: "EDIT_BENEFICIARY" };
          tcc: { type: "BENEFICIARY" } | { type: "NO_PERMISSION" };
        },
        {
          frontend: { type: "BENEFICIARY" } | { type: "NO_PERMISSION" };
          tcc: { type: "EDIT_BENEFICIARY" } | { type: "EDIT_BENEFICIARY" };
        }
      >;
      tcc: FromToConfig<
        {
          lambda: { type: "EDIT_BENEFICIARY" } | { type: "EDIT_BENEFICIARY" };
        },
        {
          lambda: { type: "BENEFICIARY" } | { type: "NO_PERMISSION" };
        }
      >;
    };
  };
  makePayment: {
    environments: {
      frontend: FromToConfig<
        {
          lambda: { type: "NEEDS_AUTH" } | { type: "PAYMENT_SCHEDULED" };
        },
        {
          lambda: { type: "MAKE_PAYMENT" } | { type: "MAKE_PAYMENT" };
        }
      >;
      lambda: FromToConfig<
        {
          frontend: { type: "MAKE_PAYMENT" } | { type: "MAKE_PAYMENT" };
          hasura:
            | { type: "NEEDS_AUTH" }
            | { type: "SUCCESS" }
            | { type: "NEEDS_NO_AUTH" };
          tcc: { type: "PAYMENT_SCHEDULED" };
        },
        {
          frontend: { type: "NEEDS_AUTH" } | { type: "PAYMENT_SCHEDULED" };
          hasura:
            | { type: "CHECK_PAYMENT_NEEDS_AUTH" }
            | { type: "STORE_PAYMENT" }
            | { type: "CHECK_PAYMENT_NEEDS_AUTH" };
          tcc: { type: "MAKE_PAYMENT" };
        }
      >;
      hasura: FromToConfig<
        {
          lambda:
            | { type: "CHECK_PAYMENT_NEEDS_AUTH" }
            | { type: "STORE_PAYMENT" }
            | { type: "CHECK_PAYMENT_NEEDS_AUTH" };
        },
        {
          lambda:
            | { type: "NEEDS_AUTH" }
            | { type: "SUCCESS" }
            | { type: "NEEDS_NO_AUTH" };
        }
      >;
      tcc: FromToConfig<
        {
          lambda: { type: "MAKE_PAYMENT" };
        },
        {
          lambda: { type: "PAYMENT_SCHEDULED" };
        }
      >;
    };
  };
  tccPaymentWebhooks: {
    environments: {
      tccWebhooks: FromToConfig<
        {},
        {
          lambda:
            | { type: "PAYMENT_COMPLETED" }
            | { type: "PAYMENT_FAILED" }
            | { type: "PAYMENT_FAILED_COMPLIANCE" };
        }
      >;
      lambda: FromToConfig<
        {
          tccWebhooks:
            | { type: "PAYMENT_COMPLETED" }
            | { type: "PAYMENT_FAILED" }
            | { type: "PAYMENT_FAILED_COMPLIANCE" };
          hasura:
            | { type: "SUCCESS" }
            | { type: "SUCCESS" }
            | { type: "SUCCESS" };
        },
        {
          hasura:
            | { type: "PAYMENT_COMPLETED" }
            | { type: "PAYMENT_FAILED" }
            | { type: "PAYMENT_FAILED_COMPLIANCE" };
        }
      >;
      hasura: FromToConfig<
        {
          lambda:
            | { type: "PAYMENT_COMPLETED" }
            | { type: "PAYMENT_FAILED" }
            | { type: "PAYMENT_FAILED_COMPLIANCE" };
        },
        {
          lambda:
            | { type: "SUCCESS" }
            | { type: "SUCCESS" }
            | { type: "SUCCESS" };
        }
      >;
    };
  };
  deleteBeneficiary: {
    environments: {
      frontend: FromToConfig<
        {
          lambda: { type: "SUCCESS" };
        },
        {
          lambda: { type: "DELETE_BENEFICIARY" };
        }
      >;
      lambda: FromToConfig<
        {
          frontend: { type: "DELETE_BENEFICIARY" };
          tcc: { type: "SUCCESS" };
        },
        {
          frontend: { type: "SUCCESS" };
          tcc: { type: "DELETE_BENEFICIARY" };
        }
      >;
      tcc: FromToConfig<
        {
          lambda: { type: "DELETE_BENEFICIARY" };
        },
        {
          lambda: { type: "SUCCESS" };
        }
      >;
    };
  };
}

interface EventConfig {
  in: { type: string };
  out: { type: string };
}

interface EnvironmentConfig {
  from: { [environment: string]: EventConfig };
  to: { [environment: string]: EventConfig };
}

type ImplementationFunction<
  TEventConfig extends EventConfig,
  TEnvironmentConfig extends EnvironmentConfig
> = (
  event: TEventConfig["in"],
  context: {
    environments: {
      [K in keyof TEnvironmentConfig["to"]]: Sender<
        TEnvironmentConfig["to"][K]
      >;
    };
  },
  callback: (event: TEventConfig["out"]) => void,
) => void | Promise<void>;

interface Sender<TEventConfig extends EventConfig> {
  promise: (event: TEventConfig["in"]) => Promise<TEventConfig["out"]>;
}

const createActor = <
  IService extends keyof Services,
  IInitialEnvironment extends keyof Services[IService]["environments"],
  IFromEnvironment extends keyof Services[IService]["environments"][IInitialEnvironment]["from"]
>(
  service: IService,
  environment: IInitialEnvironment,
  {
    to,
  }: {
    from: {
      environment: IFromEnvironment;
      handler: ImplementationFunction<
        Services[IService]["environments"][IInitialEnvironment]["from"][IFromEnvironment],
        Services[IService]["environments"][IInitialEnvironment]
      >;
    };
    to: {
      [SourceEnvKey in keyof Services[IService]["environments"][IInitialEnvironment]["to"]]: ImplementationFunction<
        Services[IService]["environments"][IInitialEnvironment]["to"][SourceEnvKey],
        Services[IService]["environments"][SourceEnvKey]
      >;
    };
  },
): Sender<Services[IService]["environments"][IInitialEnvironment]["from"][IFromEnvironment]> => {
  return {} as any;
};
