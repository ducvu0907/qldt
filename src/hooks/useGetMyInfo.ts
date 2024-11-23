import { useState, useEffect, useContext, useCallback } from 'react';
import { AUTH_SERVER_URL } from '../types';
import { useLogout } from '../hooks/useLogout';
import Toast from 'react-native-toast-message';
import { AuthContext } from '../contexts/AuthContext';

export const useGetMyInfo = () => {
  const { token } = useContext(AuthContext);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { logout } = useLogout();

  const fetchUserData = useCallback(async () => {

    try {
      console.log("fetching my info");

      let res = await fetch(`${AUTH_SERVER_URL}/get_user_info`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();

      if (data.code !== "1000") {
        throw new Error(data.message || "Error while fetching user info");
      }

      setUser(data.data);

    } catch (error: any) {
      logout();
      Toast.show({
        type: 'error',
        text1: error.message,
      });
    } finally {
      setLoading(false);
    }

  }, [token, logout]);

  useEffect(() => {
    if (token) {
      fetchUserData();
    }
  }, []);

  return { user, loading };
};