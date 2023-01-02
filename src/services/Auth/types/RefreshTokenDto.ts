import * as Yup from "yup";

export type TRefreshTokenDto = {
  refreshToken: string;
};

export const refreshTokenSchema = Yup.object({
  refreshToken: Yup.string().required(),
});
