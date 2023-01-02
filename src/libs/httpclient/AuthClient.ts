import axios, { AxiosInstance, AxiosResponse } from "axios";
import { CookieValueTypes, getCookie, setCookie } from "cookies-next"; // https://github.com/andreizanik/cookies-next

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
const URL_TOKEN_REQUEST = AUTH_CONFIG.URL_API_TOKEN_REQUEST;

/**
 * Provides Client and SSR Bearer token authentication.
 */
export class AuthClient implements IAuthClient {
  private authToken: TAuthToken;
  client: AxiosInstance;

  constructor(private options?: IAuthClientOptions) {
    const headers = {
      "Content-type": "application/json",
    };

    const config = {
      baseURL: this.options?.tokenRequestUri || URL_TOKEN_REQUEST,
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
    const nextContext = this.options?.nextContext;
    let accessToken: CookieValueTypes;
    let refreshToken: CookieValueTypes;

    // SSR
    const req = nextContext?.req;
    const res = nextContext?.res;
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

  /**
   * Set token to Cookies
   */
  setTokenToCookies(accessToken: string, refreshToken: string): void {
    setCookie(AUTH_CONFIG.COOKIE_ACCESS_TOKEN_NAME, accessToken);
    setCookie(AUTH_CONFIG.COOKIE_REFRESH_TOKEN_NAME, refreshToken);
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
      method: "POST",
      headers,
      data: payload,
    };

    // send request and wrap in a response
    const response: AxiosResponse = await this.client.request(request);
    return new HttpResponse(response, undefined, 0);
  }
}
