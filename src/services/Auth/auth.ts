import { NextPageContext } from "next";

import AuthRepository from "./repository";

import { TAuthGuard } from "@src/containers/AuthGuard";
import * as DTO from "./types";
import { AuthClient, IHttpClientOptions } from "@src/libs/httpclient";

const getCurrentUser = async (ctx: NextPageContext) => {
  return await AuthRepository.getCurrentUser(ctx);
};

const checkUserAuthentication = async (
  ctx: NextPageContext
): Promise<TAuthGuard> => {
  try {
    const response = await AuthRepository.getCurrentUser(ctx);
    return {
      data: response.data,
      error: null,
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

const register = async (
  params: DTO.TRegisterDto,
  options?: IHttpClientOptions
) => {
  const payload: DTO.TRegisterDto = await DTO.registerSchema.validate(params);
  const response = await AuthRepository.register(payload, options);
  return response.data;
};

const login = async (params: DTO.TLoginDto, options?: IHttpClientOptions) => {
  const payload: DTO.TLoginDto = await DTO.loginSchema.validate(params);

  const response = await AuthRepository.login(payload, options);
  const accessToken = response.data.accessToken;
  const refreshToken = response.data.refreshToken;

  // save to cookies
  const authLib = new AuthClient();
  await authLib.setTokenToCookies(accessToken, refreshToken);

  return response.data;
};

const AuthServices = {
  getCurrentUser,
  checkUserAuthentication,
  register,
  login,
};

export default AuthServices;
