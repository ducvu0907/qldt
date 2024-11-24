import { useState, useEffect, useContext, useCallback } from 'react';
import { RESOURCE_SERVER_URL } from '../types';
import Toast from 'react-native-toast-message';
import { AuthContext } from '../contexts/AuthContext';
import { AssignmentResponseItemData } from '../components/AssignmentResponseItem';

export const useGetAssignmentResponses = (assignment_id: number) => {
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [responses, setResponses] = useState<AssignmentResponseItemData[] | null>(null);

  const fetchAssignmentResponses = useCallback(async () => {
    try {
      setLoading(true);
      console.log("Fetching assignment responses");

      const res = await fetch(`${RESOURCE_SERVER_URL}/get_survey_response`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          survey_id: assignment_id
        }),
      });

      const data = await res.json();

      if (data.meta.code !== "1000") {
        throw new Error(data.meta.message || "Error while fetching assignment responses");
      }

      console.log(data.data);
      setResponses([...data.data]);

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
    fetchAssignmentResponses();
  }, []);

  return { responses, loading, refetch: fetchAssignmentResponses };
};