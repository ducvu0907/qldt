import { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import * as SecureStore from "expo-secure-store";
import Toast from "react-native-toast-message";
import { AUTH_SERVER_URL } from "../types";

export const useLogout = () => {
  const { token, setToken, setRole, setUserId, setEmail } = useContext(AuthContext);
  const [loading, setLoading] = useState<boolean>(false);

  const logout = async () => {
    try {
      setLoading(true);
      fetch(`${AUTH_SERVER_URL}/logout`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          token
        }),
      });

      await SecureStore.deleteItemAsync("access-token");
      setToken(null);
      setRole(null);
      setUserId(null);
      setEmail(null);

    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: error.message
      });
    } finally {
      setLoading(false);
    }

  };

  return { logout, loading };
};
