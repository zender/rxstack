export abstract class AbstractCommand {
  command: string;
  describe: string;
  abstract handler(argv: any): Promise<void>;
}