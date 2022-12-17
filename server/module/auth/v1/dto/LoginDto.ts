import * as Yup from "yup";

export type TLoginDto = {
  email: string;
  password: string;
};

export const loginSchema = Yup.object({
  email: Yup.string().email().required(),
  password: Yup.string().required(),
});
