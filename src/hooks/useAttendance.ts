import { useState, useEffect, useContext, useCallback } from 'react';
import { RESOURCE_SERVER_URL } from '../types';
import Toast from 'react-native-toast-message';
import { AuthContext } from '../contexts/AuthContext';
import { ClassContext } from '../contexts/ClassContext';

const useGetAttendance = (date: string) => {
  const { token } = useContext(AuthContext);
  const { selectedClassId } = useContext(ClassContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [attendanceData, setAttendanceData] = useState<any | null>(null);

  const fetchAttendance = useCallback(async () => {
    try {
      setLoading(true);
      console.log("Fetching attendance for date:", date);

      let res = await fetch(`${RESOURCE_SERVER_URL}/get_attendance_list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          class_id: selectedClassId,
          date,
        }),
      });

      const data = await res.json();

      if (data.meta.code !== "1000") {
        throw new Error(data.meta.message || "Error while fetching attendance list");
      }

      console.log(data.data);
      setAttendanceData(data.data.attendance_student_details);

    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: error.message,
      });

    } finally {
      setLoading(false);
    }
  }, [token, date, selectedClassId]);

  useEffect(() => {
    fetchAttendance();
  }, []);

  return { attendanceData, loading, refetch: fetchAttendance };
};

export {
  useGetAttendance,
};
