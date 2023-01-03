import type { NextPageContext } from "next";

/**
 * Performs token-based authentication with a 3rd party provider.
 */
export interface IAuthClient {
  /**
   * Asynchronously refreshes the token. This sets the
   * token promise of the client.
   * @returns {Promise<void>}
   */
  refreshToken(): Promise<TAuthToken>;

  /**
   * Updates the header to be sent with an HTTP
   * request in order to provide authentication.
   */
  getAuthHeader(): Promise<object>;
}

/**
 * Client to perform an Auth client Options.
 */
export interface IAuthClientOptions {
  /**
   * res from next.js to get Auth in cookies
   * should be optional for setCookies only
   */
  nextContext?: NextPageContext;

  /**
   * Request URI to be used. For Auth0, this follows the scheme 'https://baseUri/oauth/token'.
   */
  tokenRequestUri?: string;
}

export type TAuthToken = {
  accessToken: string;
  refreshToken: string;
};

export interface IBearerAuth {
  Authorization: string;
}
