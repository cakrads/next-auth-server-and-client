import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Performs token-based authentication with a 3rd party provider.
 */
export interface IAuthClient {
  /**
   * Asynchronously refreshes the token. This sets the
   * token promise of the client.
   * @returns {Promise<void>}
   */
  refreshToken(): Promise<void>;

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
   */
  req: NextApiRequest;

  /**
   * res from next.js to get Auth in cookies
   */
  res: NextApiResponse;

  /**
   * Request URI to be used. For Auth0, this follows the scheme 'https://baseUri/oauth/token'.
   */
  tokenRequestUri?: string;
}

export type TAuthToken = {
  access_token: string;
  refresh_token: string;
};

export interface IBearerAuth {
  Authorization: string;
}
