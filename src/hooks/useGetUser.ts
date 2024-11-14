import { useState, useEffect, useContext } from 'react';
import { AUTH_SERVER_URL } from '../types';
import { useLogout } from '../hooks/useLogout';
import Toast from 'react-native-toast-message';
import { AuthContext } from '../contexts/AuthContext';

export const useGetUser = () => {
  const {token} = useContext(AuthContext);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { logout } = useLogout();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${AUTH_SERVER_URL}/get_user_info`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ "token": token }),
        });

        if (!res.ok) {
          throw new Error('server error');
        }

        const data = await res.json();

        if (data.code !== 1000) {
          throw new Error(data.message);
        }

        setUser(data.data);

      } catch (error: any) {
        logout();
        Toast.show({
          type: "error",
          text1: error.message,
        });

      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  return { user, loading };
};
