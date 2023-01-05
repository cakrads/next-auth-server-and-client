import * as Yup from "yup";

export type TLogoutDto = {
  refreshToken: string;
};

export const logoutSchema = Yup.object({
  refreshToken: Yup.string().required(),
});
