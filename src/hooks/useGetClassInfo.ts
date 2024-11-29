import { useState, useEffect, useContext, useCallback } from 'react';
import { RESOURCE_SERVER_URL } from '../types';
import Toast from 'react-native-toast-message';
import { AuthContext } from '../contexts/AuthContext';
import { ClassDetail } from '../components/ClassInfo';

export const useGetClassInfo = (class_id: string) => {
  const { token, role } = useContext(AuthContext);
  const [classInfo, setClassInfo] = useState<ClassDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchClassInfo = useCallback(async () => {
    try {
      console.log("fetching class info");

      const res = await fetch(`${RESOURCE_SERVER_URL}/get_class_info`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, class_id }),
      });

      const data = await res.json();

      if (data.meta.code !== "1000") {
        throw new Error(data.meta.message || "Error while fetching class info");
      }

      console.log(data.data);
      setClassInfo(data.data);

    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: error.message,
      });
    } finally {
      setLoading(false);
    }
  }, [token, class_id]);

  useEffect(() => {
    if (token && class_id) {
      fetchClassInfo();
    }
  }, [token, class_id]);

  return { classInfo, loading, refetch: fetchClassInfo };
};

export const useGetBasicClassInfo = (class_id: string) => {
  const { token } = useContext(AuthContext);
  const [classInfo, setClassInfo] = useState<ClassDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchClassInfo = useCallback(async () => {
    try {
      console.log("fetching class info");

      const res = await fetch(`${RESOURCE_SERVER_URL}/get_basic_class_info`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, class_id }),
      });

      const data = await res.json();

      if (data.meta.code !== "1000") {
        throw new Error(data.meta.message || "Error while fetching class info");
      }

      console.log(data.data);
      setClassInfo(data.data);

    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: error.message,
      });
    } finally {
      setLoading(false);
    }
  }, [token, class_id]);

  useEffect(() => {
    if (token && class_id) {
      fetchClassInfo();
    }
  }, [token, class_id]);

  return { classInfo, loading, refetch: fetchClassInfo };
};