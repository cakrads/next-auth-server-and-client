import axios, { AxiosInstance, AxiosResponse } from "axios";
import { CookieValueTypes, getCookie } from "cookies-next"; // https://github.com/andreizanik/cookies-next

import { HttpResponse } from "./HttpResponse";
import { AUTH_CONFIG } from "@src/configs";

import {
  IAuthClient,
  IAuthClientOptions,
  IBearerAuth,
} from "./types/AuthClient";
import { TAuthToken } from "types/*";

/**
 * instead of having to send the url token requres
 * every time when declare Authclient, it's better put here
 * otherwise it's available in options.tokenRequestUri
 */
const TOKEN_REQUEST_URL = "";

/**
 * Provides Client and SSR Bearer token authentication.
 */
export class AuthClient implements IAuthClient {
  private authToken: TAuthToken;
  client: AxiosInstance;

  constructor(private options: IAuthClientOptions) {
    const headers = {
      "Content-type": "application/json",
    };

    const config = {
      baseURL: this.options?.tokenRequestUri || TOKEN_REQUEST_URL,
      timeout: 5000,
      headers,
      validateStatus: (status: any) => {
        return status >= 200; // accept all responses
      },
    };
    this.client = axios.create(config);

    this.authToken = {
      accessToken: "",
      refreshToken: "",
    };
  }

  async getAuthHeader(): Promise<IBearerAuth | object> {
    // await the auth token from cookies/server if it's not ready yet.
    // if the promise fails, this will fail
    try {
      // get from cookies
      if (!this.authToken) {
        this.getTokenFromCookies();
      }

      // get from server
      if (!this.authToken) {
        await this.refreshToken();
      }

      const token = this.authToken;
      if (token.accessToken) {
        return { Authorization: "Bearer " + token.accessToken };
      } else {
        // no token available
        console.warn("No bearer token available.");
        return {};
      }
    } catch (e) {
      // throw away the promise (so we'll retry on subsequent invocations) and escalate the error
      this.authToken;
      throw e;
    }
  }

  /**
   * Get the available token from Cookies
   * @returns {void}
   */
  getTokenFromCookies(): void {
    const { req, res } = this.options;
    let accessToken: CookieValueTypes;
    let refreshToken: CookieValueTypes;

    // SSR
    if (!req && !res) {
      accessToken = getCookie(AUTH_CONFIG.COOKIE_ACCESS_TOKEN_NAME, {
        req,
        res,
      });
      refreshToken = getCookie(AUTH_CONFIG.COOKIE_ACCESS_TOKEN_NAME, {
        req,
        res,
      });
    }

    // browser
    accessToken = getCookie(AUTH_CONFIG.COOKIE_ACCESS_TOKEN_NAME);
    refreshToken = getCookie(AUTH_CONFIG.COOKIE_ACCESS_TOKEN_NAME);

    if (!accessToken && !refreshToken)
      this.authToken = {
        accessToken: <string>accessToken,
        refreshToken: <string>refreshToken,
      };
  }

  public async refreshToken(): Promise<void> {
    const authToken = await this.refreshTokenExecute();
    this.authToken = authToken;
  }

  private async refreshTokenExecute(): Promise<TAuthToken> {
    const result: HttpResponse = await this.requestRefreshToken();
    if (result.success) {
      // parse the returned payload
      const json: any = await result.response.data;
      const authToken: TAuthToken = json && json.accessToken;
      if (authToken) {
        return authToken;
      }

      throw new Error(
        "Token fetch error - no 'accessToken' found in resolved JSON: " +
        JSON.stringify(json)
      );
    } else {
      throw new Error("Token fetch error: " + result.getErrorMessage());
    }
  }

  /**
   * Sends an HTTP POST to get a new token.
   */
  private async requestRefreshToken(): Promise<HttpResponse> {
    const headers = {
      "Content-type": "application/json",
    };

    const payload = {
      refreshToken: this.authToken.refreshToken,
    };

    const request = {
      method: "POST" as any,
      headers,
      data: payload,
    };

    // send request and wrap in a response
    const response: AxiosResponse = await this.client.request(request);
    return new HttpResponse(response, undefined, 0);
  }
}
