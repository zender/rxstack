import { Server as HttpServer } from 'http';
import {RouteDefinition} from '@rxstack/kernel';
import {Injector} from 'injection-js';
import {Logger} from '@rxstack/logger';

/**
 * Base class for servers
 */
export abstract class AbstractServer {

  /**
   * Injector
   */
  protected injector: Injector;

  /**
   * Server engine
   */
  protected engine: any;

  /**
   * Hostname
   */
  protected host: string;

  /**
   * Port number server is running on
   */
  protected port: number;

  /**
   * Http Server
   */
  protected httpServer: HttpServer;

  /**
   * Sets injector
   *
   * @param {Injector} injector
   */
  setInjector(injector: Injector): void {
    this.injector = injector;
  }

  /**
   * Gets injector
   *
   * @returns {Injector}
   */
  getInjector(): Injector {
    return this.injector;
  }

  /**
   * Kicks off the server
   */
  async start(routeDefinitions: RouteDefinition[]): Promise<void> {
    await this.configure(routeDefinitions);
    await this.startEngine();
  }

  /**
   * Retrieve the base instance of Server
   * @returns {HttpServer}
   */
  getHttpServer(): HttpServer {
    return this.httpServer;
  }

  /**
   * Retrieve underlying engine
   *
   * @returns {any}
   */
  getEngine(): any {
    return this.engine;
  }

  /**
   * Kicks off the server using the specific underlying engine
   */
  async startEngine(): Promise<void> {
    this.getHttpServer()
      .listen(this.port, this.host, () => this.getLogger().debug(`Starting ${this.getHost()}`));
  }

  /**
   * Stops underlying engine
   *
   * @returns {Promise<void>}
   */
  async stopEngine(): Promise<void> {
    this.getHttpServer().close(() => this.getLogger().debug(`Stopping ${this.getHost()}`));
  }

  /**
   * Get the host name (for logging)
   * @returns {string}
   */
  getHost(): string {
    return `http://${this.host}:${this.port}`;
  }

  /**
   * Logger
   *
   * @returns {Logger}
   */
  protected getLogger(): Logger {
    return this.getInjector().get(Logger).source(this.constructor.name);
  }

  /**
   * Configures the server
   *
   * @param {RouteDefinition[]} routeDefinitions
   * @returns {Promise<void>}
   */
  protected abstract async configure(routeDefinitions: RouteDefinition[]): Promise<void>;
}
