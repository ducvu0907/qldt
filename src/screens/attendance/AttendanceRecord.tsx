import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { ClassContext } from "../../contexts/ClassContext";
import { FlatList, Text, View, ActivityIndicator, TouchableOpacity } from "react-native";
import Topbar from "../../components/Topbar";
import { useNavigation } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { RESOURCE_SERVER_URL } from "../../types";
import Toast from "react-native-toast-message";

export interface AttendanceRecordRequest {
  token: string;
  class_id: string;
};

const AttendanceRecord = () => {
  const { token } = useContext(AuthContext);
  const { selectedClassId } = useContext(ClassContext);
  const [records, setRecords] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation<any>();

  useEffect(() => {
    const fetchAttendanceRecords = async () => {
      if (!token || !selectedClassId) return;

      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${RESOURCE_SERVER_URL}/get_attendance_record`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token,
            class_id: selectedClassId
          }),
        });

        const data = await response.json();

        if (data.meta.code !== "1000") {
          throw new Error(data.meta.message || "Error while fetching attendance records");
        }

        console.log(data);
        setRecords(data.data.absent_dates);

      } catch (error: any) {
        Toast.show({
          type: "error",
          text1: error.message
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceRecords();
  }, [token, selectedClassId]);

  if (loading) {
    return (
      <View className="flex justify-center items-center bg-gray-100">
        <Topbar title="Attendance Records" showBack={true} />
        <ActivityIndicator size="large" color="#4B5563" />
        <Text className="mt-4 text-xl text-gray-600">Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex justify-center items-center bg-gray-100">
        <Topbar title="Attendance Records" showBack={true} />
        <Text className="mt-4 text-xl text-red-600">{error}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100">
      <Topbar title="Attendance Records" showBack={true} />
      {records ? (
        <FlatList
          data={records}
          renderItem={({ item }) => (
            <View className="p-4 flex-row justify-evenly items-center border-b border-gray-300">
              <Text className="text-2xl font-semibold">Absent Date:</Text>
                <Text className="text-2xl mt-2 text-gray-600">{item}</Text>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <Text className="mt-4 text-xl text-center text-gray-600">No attendance records available</Text>
      )}
    </View>
  );
};

export default AttendanceRecord;
