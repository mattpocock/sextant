export interface Database {
  environments: Record<string, Environment>;
  services: Record<string, Service>;
  events: Record<string, Event>;
}

export interface Environment {
  id: string;
}

export interface Service {
  id: string;
  from: string;
  to: string;
  receivableEvents: string[];
  sendableEvents: string[];
}

export interface Event {
  id: string;
  /** JSON schema payload of the event */
  payload: any;
}
