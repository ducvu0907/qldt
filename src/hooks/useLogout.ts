import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import * as SecureStore from "expo-secure-store";
import Toast from "react-native-toast-message";

export const useLogout = () => {
  const { setToken } = useContext(AuthContext);

  const logout = async () => {
    console.log("logging out");
    await SecureStore.deleteItemAsync("access-token");
    setToken(null);
    Toast.show({
      type: "success",
      text1: "logging out"
    });
  };

  return { logout };
};
