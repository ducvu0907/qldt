import { useState, useEffect, useContext } from 'react';
import { AUTH_SERVER_URL } from '../types';
import { useLogout } from '../hooks/useLogout';
import Toast from 'react-native-toast-message';
import { AuthContext } from '../contexts/AuthContext';

export const useGetUser = () => {
  const { token } = useContext(AuthContext);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [attempt, setAttempt] = useState<number>(3); // refetch attempts
  const { logout } = useLogout();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log("fetching user info");

        let res = await fetch(`${AUTH_SERVER_URL}/get_user_info`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ "token": token }),
        });

        if (!res.ok) {
          if (attempt === 0) {
            throw new Error('server error');
          }
          res = await fetch(`${AUTH_SERVER_URL}/get_user_info`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "token": token }),
          });
          setAttempt(attempt - 1);
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
  }, []);

  return { user, loading };
};
