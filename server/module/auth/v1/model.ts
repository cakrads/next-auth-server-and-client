import * as db from "@server/db";
import { TAuth, TAuthToken } from "types";

const list = async (): Promise<any> => {
  return db.auth.data;
};

const isExist = async (email: string): Promise<any> => {
  const check = db.auth.findUnique(email);
  if (check) return { status: true, message: "user exist" };
  else return { status: false };
};

const find = async (email: string): Promise<any> => {
  return db.auth.findUnique(email);
};

const register = async (auth: TAuth): Promise<any> => {
  return db.auth.create(auth);
};

const update = (auth: TAuth) => {
  return db.auth.update(auth.email, auth);
};

const updateToken = (email: string, token: TAuthToken) => {
  const auth = db.auth.findUnique(email);
  const newAuth: TAuth = {
    ...auth,
    accessToken: token.accessToken,
    refreshToken: token.refreshToken,
  };
  return db.auth.update(auth.email, newAuth);
};

const AuthModel = {
  list,
  isExist,
  register,
  find,
  update,
  updateToken,
};

export default AuthModel;
