export type TUser = {
  email: string; // primary key
  password?: string;
};

export type TAuthPassword = {
  hash: string;
  salt: string;
};

export type TAuthToken = {
  accessToken: string;
  refreshToken: string;
};

export type TAuth = TUser & TAuthPassword & TAuthToken;

export type TAuthData = {
  profile: TUser;
} & TAuthToken;

export * from "./http-response";
