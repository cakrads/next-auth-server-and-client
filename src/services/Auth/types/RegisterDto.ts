import * as Yup from "yup";

export type TRegisterDto = {
  email: string;
  password: string;
};

export const registerSchema = Yup.object({
  email: Yup.string().email().required(),
  password: Yup.string().required(),
});
