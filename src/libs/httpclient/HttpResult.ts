/* inspired from: https://github.com/hardcodet/httpclient-js */
import { HttpResponse } from "./HttpResponse";
import { AxiosResponse } from "axios";

/**
 * Extends an API response with a result that is automatically
 * built from returned JSON.
 */
export class HttpResult<T = any> extends HttpResponse {
  public value: T;

  constructor(val: T, res: AxiosResponse, error: any, attempts: number) {
    super(res, error, attempts);

    this.value = val;
    this.response = res;
    this.error = error;
    this.attempts = attempts;
  }

  /**
   * Unwraps the underlying response value if the response was a success. Otherwise
   * throws an exception.
   */
  public getValueOrThrow(): T {
    this.ensureSuccess();
    return this.value;
  }
}
