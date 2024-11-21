import { useState, useEffect, useContext, useCallback } from 'react';
import { RESOURCE_SERVER_URL } from '../types';
import Toast from 'react-native-toast-message';
import { AuthContext } from '../contexts/AuthContext';
import { ClassItemData } from '../components/ClassListItem';

// TODO: pagination
export const useGetClasses = () => {
  const { token, setToken } = useContext(AuthContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [classes, setClasses] = useState<ClassItemData[] | null>(null);

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

      if (data.meta.code !== "1000") {
        if (data.meta.code === "9998") {
          setToken(null);
        }
        throw new Error(data.meta.message || "Error while fetching classes");
      }

      console.log(data.data);

      setClasses([...data.data.page_content]);

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
