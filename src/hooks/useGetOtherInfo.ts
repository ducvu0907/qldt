import { useState, useEffect, useContext, useCallback } from 'react';
import { AUTH_SERVER_URL } from '../types';
import Toast from 'react-native-toast-message';
import { AuthContext } from '../contexts/AuthContext';
import { useLogout } from './useLogout';

export const useGetOtherInfo = (user_id: string) => {
  const { token } = useContext(AuthContext);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUserData = useCallback(async () => {
    try {
      console.log("fetching other user info");

      const res = await fetch(`${AUTH_SERVER_URL}/get_user_info`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          user_id
        }),
      });

      const data = await res.json();

      if (data.code !== "1000") {
        throw new Error(data.message);
      }

      console.log(data.data);
      setUser(data.data);
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: error.message,
      });
    } finally {
      setLoading(false);
    }

  }, [token]);

  useEffect(() => {
    if (token) {
      fetchUserData();
    }
  }, []);

  return { user, loading };
};
