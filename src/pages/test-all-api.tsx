import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import Link from "next/link";

import { AuthClient, HttpClient, HttpResult } from "@src/libs/httpclient";
import { AUTH_CONFIG, END_POINT, URL_API } from "@src/configs";

import {
  TAuthData,
  TLoginResponse,
  TRefreshTokenResponse,
  TUserListReponse,
} from "types/*";

const useAction = () => {
  const [httpclient, setHttpclient] = useState<HttpClient>(
    new HttpClient(URL_API)
  );
  const [auth, setAuth] = useState<TAuthData>({} as TAuthData);

  // const setCookies = () => {
  //   const authClient = new AuthClient();
  //   authClient.setTokenToCookies(auth.accessToken, auth.refreshToken);
  // };

  useEffect(() => {
    console.log(auth.accessToken);
    console.log(auth.refreshToken);
  }, [auth]);

  const setHtttpclient = () => {
    const authClient = new AuthClient();
    setHttpclient(new HttpClient(URL_API, { maxAttempts: 1, authClient }));
  };

  const user = {
    email: "cakra.ds@gmail.com",
    password: "1231231231",
  };

  const register = async () => {
    await httpclient.post(END_POINT.AUTH.REGISTER, user);
    console.log("");
    console.log("");
    console.log("================");
    console.log("");
    console.log("register success");
  };

  const login = async () => {
    const response: HttpResult<TLoginResponse> =
      await httpclient.post<TLoginResponse>(END_POINT.AUTH.LOGIN, user);
    setAuth(response.getValueOrThrow().data);
    // no need set Cookies cause has been set in server
    // setCookies();
    console.log("Login Result", response.getValueOrThrow().data);
    setHtttpclient();
  };

  const getListUser = async () => {
    console.log({ httpclient });
    const response: HttpResult<TUserListReponse> =
      await httpclient.get<TUserListReponse>(END_POINT.USER.LIST);
    const result = response.getValueOrThrow();
    console.log("user list", result.data);
  };

  const refreshToken = async () => {
    const refreshToken = getCookie(AUTH_CONFIG.COOKIE_REFRESH_TOKEN_NAME);
    const response: HttpResult<TRefreshTokenResponse> =
      await httpclient.post<TRefreshTokenResponse>(
        END_POINT.AUTH.REFRESH_TOKEN,
        { refreshToken }
      );
    setAuth(response.getValueOrThrow().data);
    console.log("RefreshToken Result", response.getValueOrThrow().data);
  };

  const logout = async () => {
    await httpclient.delete<TRefreshTokenResponse>(END_POINT.AUTH.LOGOUT, {
      refreshToken: auth.refreshToken,
    });
    setAuth({} as TAuthData);
    console.log("logout success");
  };

  return {
    auth,
    register,
    login,
    getListUser,
    refreshToken,
    logout,
  };
};

const HitAllAPIPage = () => {
  const { register, login, getListUser, refreshToken, logout } = useAction();

  const runAll = async () => {
    try {
      await register();
      await login();
      await getListUser();
      await refreshToken();
      await logout();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <button onClick={runAll}>Run All</button>
      <br />
      <br />
      <button onClick={register}>Register</button>
      <br />
      <br />
      <button onClick={login}>Login</button>
      <br />
      <br />
      <button onClick={getListUser}>List User</button>
      <br />
      <br />
      <button onClick={refreshToken}>Refresh Token</button>
      <br />
      <br />
      <button onClick={logout}>Logout</button>
      <br />
      <br />
      <br />
      <Link href="/register">Let`t Test</Link>
    </>
  );
};

export default HitAllAPIPage;
