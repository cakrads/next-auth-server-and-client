import { NextPageContext } from "next";

import {
  AuthClient,
  HttpClient,
  HttpResult,
  IHttpClientOptions,
} from "@src/libs/httpclient";
import { URL_API, END_POINT } from "@src/configs";

import * as DTO from "./types";
import {
  TLoginResponse,
  TRegisterResponse,
  TCurrentUserReponse,
} from "types/*";

const getCurrentUser = async (ctx: NextPageContext) => {
  const authClient = new AuthClient({ nextContext: ctx });
  const httpClient = new HttpClient(URL_API, { authClient });
  const response: HttpResult<TCurrentUserReponse> =
    await httpClient.get<TCurrentUserReponse>(END_POINT.USER.ME);
  return response.getValueOrThrow();
};

const register = async (
  data: DTO.TRegisterDto,
  options?: IHttpClientOptions
) => {
  const httpClient = new HttpClient(URL_API, options);
  const response: HttpResult<TRegisterResponse> =
    await httpClient.post<TRegisterResponse>(END_POINT.AUTH.REGISTER, data);
  return response.getValueOrThrow();
};

const login = async (data: DTO.TLoginDto, options?: IHttpClientOptions) => {
  const httpClient = new HttpClient(URL_API, options);
  const response: HttpResult<TLoginResponse> =
    await httpClient.post<TLoginResponse>(END_POINT.AUTH.LOGIN, data);
  return response.getValueOrThrow();
};

const AuthRepository = {
  getCurrentUser,
  register,
  login,
};

export default AuthRepository;
