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
   * Unwraps the underlying response value if the response was a success. 
   * Otherwise throws an exception, error type is object from server
   */
  public getValueOrThrow(): T {
    if (this.success)
      return this.value;
    else
      throw this.response.data;
  }

  /**
   * Unwraps the underlying response value if the response was a success. 
   * Otherwise throws an exception, error type is string.
   */
  public getValueOrThrowErrorMessage(): T {
    this.ensureSuccess();
    return this.value;
  }
}
