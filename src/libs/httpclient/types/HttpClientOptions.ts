import { IRetryStrategy } from "./RetryStrategy";
import { IAuthClient } from "./AuthClient";

import { GenericAbortSignal } from "axios";

/**
 * Options for the HTTP client.
 */
export interface IHttpClientOptions {
  /**
   * Timeout of the HTTP client in case the response is returned
   * in time. Defaults to 10000 (ms).
   */
  timeout?: number;
  /**
   * The maximum number of attempts until the client gives up. Defaults to 3 (2 retries).
   */
  maxAttempts?: number;
  /**
   * The default base delay between retry attempts. Defaults to 1000 (ms).
   */
  retryDelay?: number;
  /**
   * The delay strategy - defaults to exponential retries.
   */
  retryStrategy?: IRetryStrategy;

  /**
   * Optional authentication strategy. Invoked whenever an API call returns an HTTP 401.
   */
  authClient?: IAuthClient;

  /**
   * Optional custom headers to be included in every call.
   */
  customHeaders?: any;

  /**
   * To handle cancel request from AbortController
   */
  signal?: GenericAbortSignal;
}
