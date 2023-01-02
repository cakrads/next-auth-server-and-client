/* inspired from: https://github.com/hardcodet/httpclient-js */
import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from "axios";
import { plainToClass } from "class-transformer";
import { validateOrReject } from "class-validator";
import { HttpResponse } from "./HttpResponse";
import { HttpResult } from "./HttpResult";

import { IHttpClientOptions } from "./types/HttpClientOptions";
import { IJsonProcessor } from "./types/JsonProcessing";
import { IRetryStrategy } from "./types/RetryStrategy";

const MAX_ATTEMPTS = 10000;
const TIMEOUT = 3;
const RETRY_DELAY = 1000;

/**
 *  Example usage:
 *  const authClient = new AuthClient({ nextContext: context });
 *  this.httpClient = new HttpClient("https://api.foo.com", { authClient });
 */

/**
 * use customeType to use spesific type in result.
 * example:
 *   const result: HttpResult<User> = await httpClient.get("user/123", User);
 *   const user: User = result.value;
 * so we can access user.fullName
 */
export declare type CustomType<T> = {
  new (...args: any[]): T;
};

/**
 * HTTP / API client.
 */
export class HttpClient {
  private static instance: HttpClient;

  private baseUri: string;
  private client!: AxiosInstance;
  private customHeaders: any;
  private options: IHttpClientOptions;

  public inboundProcessors: IJsonProcessor[] = [];
  public outboundProcessors: IJsonProcessor[] = [];

  constructor(baseUri: string = "", options?: IHttpClientOptions) {
    const defaultOptions: IHttpClientOptions = {
      timeout: MAX_ATTEMPTS,
      maxAttempts: TIMEOUT,
      retryDelay: RETRY_DELAY,
      retryStrategy: IRetryStrategy.Exponential,
      authClient: undefined,
      signal: undefined,
      customHeaders: undefined,
    };

    // merge with default options
    this.options = { ...defaultOptions, ...options };

    this.baseUri = baseUri;
    this.customHeaders = this.options.customHeaders;

    this._setInstanceHeader();

    // singleton instance
    HttpClient.instance = this;
  }

  // singleton static method
  public static getInstance(
    baseUri: string = "",
    options?: IHttpClientOptions
  ): HttpClient {
    if (!HttpClient.instance)
      HttpClient.instance = new HttpClient(baseUri, options);
    return HttpClient.instance;
  }

  setCustomHeaders(headers: any) {
    this.customHeaders = headers;
    this._setInstanceHeader();
  }

  _setInstanceHeader() {
    const headers = this.customHeaders;
    const config: AxiosRequestConfig = {
      baseURL: this.baseUri,
      timeout: this.options.timeout,
      signal: this.options?.signal,
      headers,
      validateStatus: (status: any) => {
        return status >= 200; // accept all responses
      },
    };
    this.client = axios.create(config);
  }

  private executeGet(uri: string, headers?: any): Promise<HttpResponse> {
    return this._execute("GET", uri, null, headers);
  }

  async get<T>(
    uri: string,
    customType?: CustomType<T>,
    headers?: any
  ): Promise<HttpResult<T>> {
    const response = await this.executeGet(uri, headers);
    return this._parseResultInternal<T>(response, customType);
  }

  private executePost(
    uri: string,
    data?: any,
    headers?: any
  ): Promise<HttpResponse> {
    return this._execute("POST", uri, data, headers);
  }

  async post<T>(
    uri: string,
    data?: any,
    customType?: CustomType<T>,
    headers?: any
  ): Promise<HttpResult<T>> {
    const response = await this.executePost(uri, data, headers);
    return this._parseResultInternal<T>(response, customType);
  }

  private executePut(
    uri: string,
    data?: any,
    headers?: any
  ): Promise<HttpResponse> {
    return this._execute("PUT", uri, data, headers);
  }

  async put<T>(
    uri: string,
    data?: any,
    customType?: CustomType<T>,
    headers?: any
  ): Promise<HttpResult<T>> {
    const response = await this.executePut(uri, data, headers);
    return this._parseResultInternal<T>(response, customType);
  }

  private executeDelete(
    uri: string,
    data?: any,
    headers?: any
  ): Promise<HttpResponse> {
    return this._execute("DELETE", uri, data, headers);
  }

  async delete<T>(
    uri: string,
    data?: any,
    customType?: CustomType<T>,
    headers?: any
  ): Promise<HttpResult<T>> {
    const response = await this.executeDelete(uri, data, headers);
    return this._parseResultInternal<T>(response, customType);
  }

  private _execute(
    method: any,
    uri: string,
    data: any,
    headers: any
  ): Promise<HttpResponse> {
    return this._executeWithRetries(method, uri, data, headers, 1);
  }

  private async _executeWithRetries(
    method: any,
    uri: string,
    data: any,
    headers: any,
    attemptCounter: number
  ): Promise<HttpResponse> {
    try {
      let body = null;

      if (this.options.authClient) {
        const authHeader = await this.options.authClient.getAuthHeader();
        headers = { ...headers, ...authHeader };
      }

      if (data) {
        let processedData = data;
        this.outboundProcessors.forEach(
          (p) => (processedData = p.processJson(processedData))
        );
        body = processedData;
      }

      const request = {
        method,
        url: uri,
        headers,
        data: body,
      };

      // send request (http errors will still pass our custom validation function)
      const res: AxiosResponse = await this.client.request(request);
      const success = res.status >= 200 && res.status < 300;

      // we're done
      //  - if we're all good (HTTP 2xx)
      //  - if we attempted already the max amount of attempts/retries
      //  - in case of client errors (HTTP 4xx except 401) or redirects (HTTP 3xx)
      if (
        success ||
        attemptCounter >= (this.options?.maxAttempts || MAX_ATTEMPTS) ||
        (res.status < 500 && res.status !== 401)
      ) {
        return new HttpResponse(res, undefined, attemptCounter);
      }

      if (
        res.status === 401 &&
        attemptCounter === 1 &&
        this.options.authClient
      ) {
        // in case of an initial 401, refresh the token and retry
        // if this blows up with an exception, the refresh error will be returned as the
        // API result, which should serve well to diagnose things
        await this.options.authClient.refreshToken();
      } else {
        // otherwise delay, then recurse to try again
        const delay = this._calculateRetryDelay(attemptCounter);
        await new Promise((r) => setTimeout(r, delay));
      }
      return await this._executeWithRetries(
        method,
        uri,
        data,
        headers,
        attemptCounter + 1
      );
    } catch (error) {
      // the request itself failed - include the error
      return new HttpResponse("" as any, error, attemptCounter);
    }
  }

  private _calculateRetryDelay(attempts: number) {
    const baseDelay = this.options?.retryDelay || RETRY_DELAY;

    switch (this.options?.retryStrategy) {
      case IRetryStrategy.Constant:
        return baseDelay;
      case IRetryStrategy.Linear:
        return baseDelay * attempts;
      default:
        return baseDelay * attempts ** 2;
    }
  }

  private async _parseResultInternal<T>(
    response: HttpResponse,
    customType?: CustomType<T>
  ): Promise<HttpResult<T>> {
    return HttpClient._parseResult<T>(
      response,
      this.inboundProcessors,
      customType
    );
  }

  static async _parseResult<T>(
    response: HttpResponse,
    inboundProcessors?: IJsonProcessor[],
    customType?: CustomType<T>
  ): Promise<HttpResult<T>> {
    try {
      if (!response.success) {
        // just wrap the original result
        return new HttpResult<T>(
          {} as T,
          response.response,
          response.error,
          response.attempts
        );
      }

      // retrieve JSON data
      let data: any = await response.response.data;

      // process/transform JSON
      if (inboundProcessors) {
        inboundProcessors.forEach((p) => (data = p.processJson(data)));
      }

      // if a transform type was specified, send the JSON through class transformer
      if (customType) {
        // transform
        data = plainToClass(customType, data);

        // validate
        await validateOrReject(data);
      }

      return new HttpResult<T>(
        data as T,
        response.response,
        undefined,
        response.attempts
      );
    } catch (e) {
      return new HttpResult<T>(
        {} as T,
        response.response,
        e,
        response.attempts
      );
    }
  }
}
