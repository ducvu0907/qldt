import { useState, useEffect, useContext, useCallback } from 'react';
import { RESOURCE_SERVER_URL } from '../types';
import { useLogout } from '../hooks/useLogout';
import Toast from 'react-native-toast-message';
import { AuthContext } from '../contexts/AuthContext';
import { ClassDetail } from '../components/ClassInfo';

export const useGetClassInfo = (class_id: string) => {
  const { token } = useContext(AuthContext);
  const [classInfo, setClassInfo] = useState<ClassDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [attempt, setAttempt] = useState<number>(3);
  const { logout } = useLogout();

  const fetchClassInfo = useCallback(async () => {
    if (attempt <= 0) return;

    try {
      console.log("fetching class info");

      const res = await fetch(`${RESOURCE_SERVER_URL}/get_class_info`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, class_id }),
      });

      if (!res.ok) {
        if (attempt > 0) {
          console.log(`Retrying... attempts left: ${attempt}`);
          setAttempt(attempt - 1);
          return;
        } else {
          throw new Error('Server error. Please try again later.');
        }
      }

      const data = await res.json();

      if (data.meta.code !== 1000) {
        throw new Error(data.meta.message || "Error while fetching class info");
      }

      setClassInfo(data.data);
      console.log(data.data);

    } catch (error: any) {
      logout();
      Toast.show({
        type: 'error',
        text1: error.message,
      });
    } finally {
      setLoading(false);
    }
  }, [attempt, token, class_id]);

  useEffect(() => {
    if (token && class_id) {
      fetchClassInfo();
    }
  }, [token, class_id]);

  return { classInfo, loading };
};
