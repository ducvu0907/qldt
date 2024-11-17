import { useState, useEffect, useContext, useCallback } from 'react';
import { RESOURCE_SERVER_URL } from '../types';
import Toast from 'react-native-toast-message';
import { AuthContext } from '../contexts/AuthContext';
import { MaterialListItemData } from '../components/MaterialListItem';
import { ClassContext } from '../contexts/ClassContext';

// FIXME: there's no way that its get method with form-data gg
export const useGetMaterials = () => {
  const { token } = useContext(AuthContext); 
  const { selectedClassId } = useContext(ClassContext);
  const [loading, setLoading] = useState<boolean>(false); 
  const [materials, setMaterials] = useState<MaterialListItemData[] | null>(null);

  const fetchMaterials = useCallback(async () => {
    try {
      if (!token || !selectedClassId) {
        throw new Error("Token or class id not found");
      }

      console.log("fetching materials");
      setLoading(true);

      const formData = new FormData();
      formData.append('token', token);
      formData.append('class_id', selectedClassId);

      const res = await fetch(`${RESOURCE_SERVER_URL}/get_material_list`, {
        method: 'GET',
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      const data = await res.json();

      if (data.code !== 1000) {
        throw new Error(data.message || "Error while fetching class materials");
      }

      console.log(data.data);
      setMaterials([...data.data]);

    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: error.message,
      });

    } finally {
      setLoading(false);
    }
  }, [token, selectedClassId]);

  useEffect(() => {
    fetchMaterials();
  }, [fetchMaterials]);

  return { materials, loading, refetch: fetchMaterials };
};
