import { Server as HttpServer } from 'http';
import {RouteDefinition} from '@rxstack/kernel';
import {Injector} from 'injection-js';

/**
 * Base class for servers
 */
export abstract class AbstractServer {

  /**
   * Injector
   */
  protected injector: Injector;

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
   * Retrieve the base instance of require('http').Server
   * @returns {HttpServer}
   */
  getHttpServer(): HttpServer {
    return this.httpServer;
  }

  /**
   * Get the host name (for logging)
   * @returns {string}
   */
  getHost(): string {
    return `http://${this.host}:${this.port}`;
  }

  /**
   * Gets underlying engine
   */
  abstract getEngine(): any;

  /**
   * Kicks off the server using the specific underlying engine
   */
  abstract async startEngine(): Promise<void>;

  /**
   * Stops underlying engine
   *
   * @returns {Promise<void>}
   */
  abstract async stopEngine(): Promise<void>;

  /**
   * Configures the server
   *
   * @param {RouteDefinition[]} routeDefinitions
   * @returns {Promise<this>}
   */
  protected abstract async configure(routeDefinitions: RouteDefinition[]): Promise<void>;

}
