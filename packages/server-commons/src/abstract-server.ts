import {Injectable, Injector} from 'injection-js';
import { Server as HttpServer } from 'http';

export abstract class AbstractServer {

  protected injector: Injector;

  protected schema: 'http' | 'https';

  /** Hostname eg `localhost`, `example.com` */
  protected host: string;
  /** Port number server is running on */
  protected port: number;

  /** `require('http').Server` object from the base class */
  protected httpServer: HttpServer;

  setInjector(injector: Injector): void {
    this.injector = injector;
  }

  /**
   * Kicks off the server
   */
  async start(): Promise<void> {
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
    return `${this.schema}://${this.host || '(localhost)'}:${this.port}`;
  }

  abstract async configure(): Promise<this>;

  /**
   * Kicks off the server using the specific underlying engine
   */
  protected abstract async startEngine(): Promise<this>;
}
