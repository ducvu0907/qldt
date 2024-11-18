import { useState, useEffect, useContext, useCallback } from 'react';
import { RESOURCE_SERVER_URL } from '../types';
import Toast from 'react-native-toast-message';
import { AuthContext } from '../contexts/AuthContext';
import { AbsenceRequestData } from '../components/AbsenceRequestItem';
import { ClassContext } from '../contexts/ClassContext';

export const useGetAbsenceRequests = (status: string) => { 
  const { token } = useContext(AuthContext);
  const { selectedClassId } = useContext(ClassContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [absenceRequests, setAbsenceRequests] = useState<AbsenceRequestData[] | null>(null);

  const fetchAbsenceRequests = useCallback(async () => {
    try {
      setLoading(true);
      console.log("Fetching absence requests...");

      const res = await fetch(`${RESOURCE_SERVER_URL}/get_absence_requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          class_id: selectedClassId,
          status // PENDING, ACCEPTED, REJECTED
        }),
      });

      const data = await res.json();

      if (data.meta.code !== 1000) {
        throw new Error(data.meta.message || "Error while fetching absence requests");
      }

      console.log(data.data);
      setAbsenceRequests([...data.data]);

    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: error.message || "An error occurred while fetching absence requests.",
      });

    } finally {
      setLoading(false);
    }
  }, [token, selectedClassId]);

  useEffect(() => {
    if (selectedClassId) {
      fetchAbsenceRequests();
    }
  }, [selectedClassId, fetchAbsenceRequests]);

  return { absenceRequests, loading, refetch: fetchAbsenceRequests };
};