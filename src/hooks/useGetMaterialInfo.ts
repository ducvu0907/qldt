import { useState, useEffect, useContext, useCallback } from 'react';
import { RESOURCE_SERVER_URL } from '../types';
import Toast from 'react-native-toast-message';
import { AuthContext } from '../contexts/AuthContext';
import { MaterialListItemData } from '../components/MaterialListItem';
import { showToastError } from '../helpers';

export const useGetMaterialInfo = (material_id: string) => {
  const { token } = useContext(AuthContext);
  const [materialInfo, setMaterialInfo] = useState<MaterialListItemData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchMaterialInfo = useCallback(async () => {
    try {
      console.log("fetching material info");
      setLoading(true);

      const queryParams = new URLSearchParams();
      queryParams.append("token", token);
      queryParams.append("material_id", material_id);

      const res = await fetch(`${RESOURCE_SERVER_URL}/get_material_info?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      if (data.meta.code !== "1000") {
        throw new Error(data.meta.message || "Error while fetching material info");
      }

      setMaterialInfo(data.data);
      console.log(data.data);

    } catch (error: any) {
      showToastError(error)
    } finally {
      setLoading(false);
    }
  }, [token, material_id]);

  useEffect(() => {
    if (token && material_id) {
      fetchMaterialInfo();
    }
  }, [token, material_id]);

  return { materialInfo, loading };
};
