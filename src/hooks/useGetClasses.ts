import { useState, useEffect, useContext, useCallback } from 'react';
import { RESOURCE_SERVER_URL } from '../types';
import Toast from 'react-native-toast-message';
import { AuthContext } from '../contexts/AuthContext';
import { ClassData } from '../components/Class';

export const useGetClasses = () => {
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [classes, setClasses] = useState<ClassData[] | null>(null);

  const fetchClasses = useCallback(async () => {
    try {
      setLoading(true);
      console.log("fetching user classes");

      let res = await fetch(`${RESOURCE_SERVER_URL}/get_class_list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();

      if (data.data === null) {
        throw new Error(data.meta.message);
      }

      console.log(data.data);
      setClasses([...data.data]);

    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: error.message,
      });

    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchClasses();
  }, []);

  return { classes, loading, refetch: fetchClasses };
};
