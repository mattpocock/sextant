import { Database, Environment, Event, Service } from "./types";

export class DatabaseHandler {
  private database: Database;
  private save: () => Promise<void>;

  constructor(database: Database, save: () => Promise<void>) {
    this.database = database;
    this.save = save;
  }

  /**
   * Events
   */
  getEventById(eventId: string): Event {
    return this.database.events[eventId];
  }

  listEvents(): Event[] {
    return Object.values(this.database.events);
  }

  async updateEventById(eventId: string, event: Partial<Omit<Event, "id">>) {
    this.database.events[eventId] = {
      ...this.database.events[eventId],
      ...event,
    };
    await this.save();
    return this.getEventById(eventId);
  }

  async createEvent(eventId: string, event: Event) {
    this.database.events[eventId] = event;
    await this.save();
    return event;
  }

  async deleteEvent(eventId: string) {
    if (this.getServicesWithEvent(eventId).length > 0) {
      throw new Error(
        "Cannot delete this event, as it has references in other services.",
      );
    }
    delete this.database.services[eventId];
    await this.save();
  }

  /**
   * Services
   */
  getServiceById(serviceId: string): Service {
    return this.database.services[serviceId];
  }

  getServicesWithEvent(eventId: string) {
    return Object.values(this.database.services).filter((service) => {
      return (
        service.receivableEvents.includes(eventId) ||
        service.sendableEvents.includes(eventId)
      );
    });
  }

  listServices(): Service[] {
    return Object.values(this.database.services);
  }

  listEventsByService(
    serviceId: string,
  ): { receivable: Event[]; sendable: Event[] } {
    const service = this.getServiceById(serviceId);
    return {
      receivable: service.receivableEvents.map((event) =>
        this.getEventById(event),
      ),
      sendable: service.sendableEvents.map((event) => this.getEventById(event)),
    };
  }

  async updateServiceById(
    serviceId: string,
    service: Partial<Omit<Service, "id">>,
  ) {
    this.database.services[serviceId] = {
      ...this.database.services[serviceId],
      ...service,
    };
    await this.save();
    return this.getServiceById(serviceId);
  }

  async createService(serviceId: string, service: Service) {
    this.database.services[serviceId] = service;
    await this.save();
    return service;
  }

  async deleteService(serviceId: string) {
    delete this.database.services[serviceId];
    await this.save();
  }

  /**
   * Environments
   */
  getEnvironmentById(environmentId: string): Environment {
    return this.database.environments[environmentId];
  }

  listEnvironments(): Environment[] {
    return Object.values(this.database.environments);
  }

  async updateEnvironmentById(
    environmentId: string,
    environment: Partial<Omit<Environment, "id">>,
  ) {
    this.database.environments[environmentId] = {
      ...this.database.environments[environmentId],
      ...environment,
    };
    await this.save();
    return this.getEnvironmentById(environmentId);
  }

  async createEnvironment(environmentId: string, environment: Environment) {
    this.database.environments[environmentId] = environment;
    await this.save();
    return environment;
  }

  async deleteEnvironment(environmentId: string) {
    this.deleteServicesByEnvironment(environmentId);
    delete this.database.environments[environmentId];

    await this.save();
  }

  private async deleteServicesByEnvironment(environmentId: string) {
    Object.values(this.database.services).forEach((service) => {
      if (service.from === environmentId || service.to === environmentId) {
        delete this.database.services[service.id];
      }
    });
    await this.save();
  }
}
