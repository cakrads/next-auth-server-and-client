import { NextPageContext } from "next";

import { AuthClient, HttpClient, HttpResult } from "@src/libs/httpclient";
import { URL_API } from "@src/configs";

import { TAuthData } from "../types";

// const AuthRepository = (ctx: NextPageContext) => {
//   const authClient = new AuthClient({ nextContext: ctx });
//   const httpClient = new HttpClient(URL_API, { authClient });

//   const getCurrentUser = async () => {
//     const result: HttpResult<TAuthData> = await httpClient.get<TAuthData>(
//       "users/v1/me"
//     );
//     return result.getValueOrThrow();
//   };

//   const cancelRequest = async () => {
//     httpClient.cancel();
//   };

//   return {
//     getCurrentUser,
//     cancelRequest,
//   };
// };

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
