import { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import * as SecureStore from "expo-secure-store";

export const useLogout = () => {
  const { setToken } = useContext(AuthContext);

  const logout = async () => {
    await SecureStore.deleteItemAsync("access-token");
    setToken(null);
  };

  return { logout };
};
