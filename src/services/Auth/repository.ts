import { NextPageContext } from "next";

import { AuthClient, HttpClient, HttpResult, IHttpClientOptions } from "@src/libs/httpclient";
import { URL_API, END_POINT } from "@src/configs";

import * as DTO from "./types";
import { TAuthData, TUser } from "types/*";

const getCurrentUser = async (ctx: NextPageContext) => {
  const authClient = new AuthClient({ nextContext: ctx });
  const httpClient = new HttpClient(URL_API, { authClient });
  const result: HttpResult<TAuthData> = await httpClient.get<TAuthData>(
    END_POINT.USER.ME
  );
  return result.getValueOrThrow();
};


const register = async (data: DTO.TRegisterDto, options?: IHttpClientOptions) => {
  const httpClient = new HttpClient(URL_API, options);
  const result: HttpResult<TUser> = await httpClient.post<TUser>(
    END_POINT.AUTH.REGISTER,
    data,
  );
  return result.getValueOrThrow();
};

const login = async (data: DTO.TLoginDto, options?: IHttpClientOptions) => {
  const httpClient = new HttpClient(URL_API, options);
  const result: HttpResult<TAuthData> = await httpClient.post<TAuthData>(
    END_POINT.AUTH.LOGIN,
    data,
  );
  return result.getValueOrThrow();
};

const AuthRepository = {
  getCurrentUser,
  register,
  login,
};

export default AuthRepository;
