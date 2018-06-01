import {Exception} from './exception';

/**
 * Transform an error to exception
 *
 * @param e
 * @returns {Exception}
 */
export function transformToException(e: any): Exception {
  if (!(e instanceof Exception)) {
    e = new Exception(e.message);
    e.data = e.stack;
  }
  return e;
}