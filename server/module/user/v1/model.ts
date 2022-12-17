import * as db from "@server/db";

const list = async (): Promise<any[]> => {
  return db.auth.data;
};

const AuthModel = {
  list,
};

export default AuthModel;
