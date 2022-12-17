import { db } from "@server/db";

const list = async (): Promise<any[]> => {
  return db.auth.data;
};

const find = async (email: string): Promise<any> => {
  return db.auth.findUnique(email);
};

const UserModel = {
  find,
  list,
};

export default UserModel;
