import { NextPageContext } from "next";

import AuthRepository from "./repository";

import { TAuthGuard, TAuthGuardError } from "@src/containers/AuthGuard";
import * as DTO from "./types";
import { AuthClient, IHttpClientOptions } from "@src/libs/httpclient";

const getCurrentUser = async (ctx: NextPageContext) => {
  return await AuthRepository.getCurrentUser(ctx);
};

const checkUserAuthentication = async (
  ctx: NextPageContext
): Promise<TAuthGuard> => {
  try {
    const data = await AuthRepository.getCurrentUser(ctx);

    return {
      data: data,
      error: {} as TAuthGuardError,
    };
  } catch (error: any) {
    return {
      data: null,
      error: {
        status: true,
        message: error.message,
      },
    };
  }
};

const login = async (params: DTO.TLoginDto, options?: IHttpClientOptions) => {
  const payload: DTO.TLoginDto = await DTO.loginSchema.validate(
    params
  );

  const request = await AuthRepository.login(payload, options);
  const accessToken = request.accessToken;
  const refreshToken = request.refreshToken;

  // save to cookies
  const authLib = new AuthClient();
  authLib.setTokenToCookies(accessToken, refreshToken);

  return request;
};

const AuthServices = {
  getCurrentUser,
  checkUserAuthentication,
  login,
};

export default AuthServices;
