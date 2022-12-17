import { TAuth } from "types";

const auth = {
  data: <TAuth[]>[],
  findUnique: function (email: string): any {
    return this.data.find((auth) => auth.email === email);
  },
  create: function (data: any): any {
    this.data.push(data);
    return data;
  },
  update: function (email: string, data: any): any {
    const index = this.data.findIndex((auth) => auth.email === email);
    if (index === -1) throw Error("Id not Found");
    this.data[index] = data;
    return data;
  },
  delete: function name(email: string): any {
    const isExist = this.data.findIndex((auth) => auth.email === email);
    if (isExist === -1) throw Error("Id not Found");
    const newAuth = this.data.filter((auth) => auth.email !== email);
    this.data = newAuth;
    return true;
  },
};

export { auth };
