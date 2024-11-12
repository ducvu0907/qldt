export type LoginRequest = {
  email: string,
  password: string,
  deviceId: number
}

export type LogoutRequest = {
  token: string,
}

export enum Roles {
  STUDENT = "STUDENT",
  TEACHER = "TEACHER",
}

export type SignupRequest = {
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  uuid: number,
  role: Roles | null,
}

export type CheckVerifyCodeRequest = {
  email: string,
  verifyCode: string,
}

export type ChangeInfoAfterSignupRequest = {
  token: string,
  username: string,
  avatar?: string,
}

export type GetVerifyCodeRequest = {
  email: string,
  password: string,
}

// TODO: write auth apis
export const loginApi = (data: LoginRequest) => {

}

export const signupApi = () => {

}

export const logoutApi = () => {

}
