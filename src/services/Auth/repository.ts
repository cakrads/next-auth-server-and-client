import { NextPageContext } from "next";

import { AuthClient, HttpClient, HttpResult } from "@src/libs/httpclient";
import { URL_API } from "@src/configs";

import { TAuthData } from "types/*";

const getCurrentUser = async (ctx: NextPageContext) => {
  const authClient = new AuthClient({ nextContext: ctx });
  const httpClient = new HttpClient(URL_API, { authClient });
  console.log({ URL_API });
  const result: HttpResult<TAuthData> = await httpClient.get<TAuthData>(
    "/user/v1/me"
  );
  return result.getValueOrThrow();
};

const AuthRepository = {
  getCurrentUser,
};

export default AuthRepository;
