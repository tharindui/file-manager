import constate from "constate";
import { getMutation } from "./_shared/query-helper";

const useUserRegisterMutation = getMutation(async (api, data) => {
  return api.post<any, any>("/Account/register", data);
});

const useUserLoginMutation = getMutation(async (api, data) => {
  return api.post<any, any>("/Account/login", data);
});

export const [AccountProvider, useRegisterUser, useLogin] = constate(
  () => {
    const userRegisterMutation = useUserRegisterMutation();
    const userLoginMutation = useUserLoginMutation();
    const registerUser = async (params: any) => {
      await userRegisterMutation.mutateAsync(params);
    };
    const UserLogin = async (params: any) => {
      await userRegisterMutation.mutateAsync(params);
    };

    return {
      registerUser,
      UserLogin,
    };
  },

  ({ registerUser }) => registerUser,
  ({ UserLogin }) => UserLogin
);
