import { TAuthToken, TAuthData, TUser } from ".";

export type THttpResponse = {
  code: number;
  data: unknown; // default
  message: string;
  success: boolean;
};

export type TRegister = TUser;
export type TLogin = TAuthData;
export type TRefreshToken = TAuthData;
export type TCurrentUser = TAuthData;
export type TUserList = (TUser & TAuthToken)[];

export type TRegisterResponse = THttpResponse & { data: TRegister };
export type TLoginResponse = THttpResponse & { data: TLogin };
export type TRefreshTokenResponse = THttpResponse & { data: TRefreshToken };
export type TCurrentUserReponse = THttpResponse & { data: TCurrentUser };
export type TUserListReponse = THttpResponse & { data: TUserList };
