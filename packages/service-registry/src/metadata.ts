/**
 * This metadata contains all information about registered service.
 */
class ServiceRegistryMetadata {
  /**
   * Target class where decorator is used
   */
  target: Function;
  /**
   * Namespace of the service manager
   */
  ns: string;
  /**
   * Unique name of the service
   */
  name: string;
  /**
   * Priority is used for sorting
   */
  priority: number;
}
