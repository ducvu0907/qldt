import { useState, useEffect, useContext, useCallback } from 'react';
import { RESOURCE_SERVER_URL } from '../types';
import Toast from 'react-native-toast-message';
import { AuthContext } from '../contexts/AuthContext';
import { AssignmentItemData } from '../components/AssignmentItem';
import { ClassContext } from '../contexts/ClassContext';

export const useGetAssignments = () => {
  const { token } = useContext(AuthContext);
  const {selectedClassId} = useContext(ClassContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [assignments, setAssignments] = useState<AssignmentItemData[] | null>(null);

  const fetchAssignments = useCallback(async () => {
    try {
      setLoading(true);
      console.log("fetching user assignments");

      let res = await fetch(`${RESOURCE_SERVER_URL}/get_all_surveys`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          class_id: selectedClassId
        }),
      });

      const data = await res.json();

      console.log(data);
      if (data.meta.code !== "1000") {
        throw new Error(data.meta.message || "Error while fetching class assignments");
      }

      console.log(data.data);
      setAssignments([...data.data]);

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
    fetchAssignments();
  }, []);

  return { assignments, loading, refetch: fetchAssignments };
};

export const useGetStudentAssignments = (type: string) => { // COMPLETED, PASS_DUE, UPCOMING, null
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [assignments, setAssignments] = useState<AssignmentItemData[] | null>(null);

  const fetchAssignments = useCallback(async () => {
    try {
      setLoading(true);
      console.log("fetching student assignments");

      let res = await fetch(`${RESOURCE_SERVER_URL}/get_student_assignments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          type
        }),
      });

      const data = await res.json();

      console.log(data);
      if (data.meta.code !== "1000") {
        throw new Error(data.meta.message || "Error while fetching class assignments");
      }

      console.log(data.data);
      setAssignments([...data.data]);

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
    fetchAssignments();
  }, []);

  return { assignments, loading, refetch: fetchAssignments };
};