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

export type TUserList = (TUser & TAuthToken)[];

export type TAuth = TUser & TAuthPassword & TAuthToken;
