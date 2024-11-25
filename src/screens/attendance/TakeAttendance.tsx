import React, { useContext, useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import Checkbox from "expo-checkbox";
import { AuthContext } from "../../contexts/AuthContext";
import { ClassContext } from "../../contexts/ClassContext";
import { useGetClassInfo } from "../../hooks/useGetClassInfo";
import Toast from "react-native-toast-message";
import { formatDate } from "../../helpers";
import { RESOURCE_SERVER_URL } from "../../types";
import Topbar from "../../components/Topbar";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { useGetAttendance } from "../../hooks/useAttendance";

export interface TakeAttendanceRequest {
  token: string;
  class_id: string;
  date: string;
  attendance_list: string[];
}

const TakeAttendance = () => {
  const navigation = useNavigation();
  const [absentIds, setAbsentIds] = useState<string[]>([]);
  const { token } = useContext(AuthContext);
  const { selectedClassId } = useContext(ClassContext);
  const { classInfo, loading: classInfoLoading } = useGetClassInfo(selectedClassId);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState<boolean>(false);

  const { attendanceData, loading: attendanceLoading } = useGetAttendance(formatDate(selectedDate));

  useEffect(() => {
    if (attendanceData) {
      const absentStudentIds = attendanceData
        .filter((entry: any) => entry.status === "UNEXCUSED_ABSENCE" || entry.status === "EXCUSED_ABSENCE")
        .map((entry: any) => entry.student_id);

        setAbsentIds((prevAbsentIds) => {
          return [...new Set([...prevAbsentIds, ...absentStudentIds])];
        });

    }
  }, [attendanceData, selectedDate]);

  const handleTakeAttendance = async () => {
    if (!selectedClassId || !token) {
      Toast.show({
        type: "error",
        text1: "Invalid class or token.",
      });
      return;
    }

    setLoading(true);
    const attendanceRequest: TakeAttendanceRequest = {
      token,
      class_id: selectedClassId,
      date: formatDate(selectedDate),
      attendance_list: absentIds,
    };

    try {
      const res = await fetch(`${RESOURCE_SERVER_URL}/take_attendance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(attendanceRequest),
      });
      const data = await res.json();

      if (data.meta.code !== "1000") {
        throw new Error(data.meta.message || "Error while taking attendance");
      }

      Toast.show({
        type: "success",
        text1: "Attendance successfully taken.",
      });

      navigation.goBack();
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: error.message || "An error occurred while taking attendance.",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleAbsence = (studentId: string) => {
    setAbsentIds((prevAbsentIds) =>
      prevAbsentIds.includes(studentId)
        ? prevAbsentIds.filter((id) => id !== studentId)
        : [...prevAbsentIds, studentId]
    );
  };

  const AttendanceHeader = () => (
    <View className="px-4 py-6 bg-white border-b border-gray-200 items-center">
      <Text className="text-center text-2xl font-bold text-gray-800">
        Attendance Record
      </Text>
      <DateTimePicker
        value={selectedDate}
        mode="date"
        is24Hour={true}
        display="default"
        onChange={(_, date) => {
          if (date) {
            setSelectedDate(date);
          }
        }}
        themeVariant="light"
        style={{ flex: 1 }}
      />
      <View className="flex-row justify-between mt-4 px-2">
        <View className="flex-row items-center">
          <View className="w-3 h-3 rounded-full bg-green-500 mr-2" />
          <Text className="text-gray-600">Present</Text>
        </View>
        <View className="flex-row items-center">
          <View className="w-3 h-3 rounded-full bg-red-500 mr-2" />
          <Text className="text-gray-600">Absent</Text>
        </View>
      </View>
    </View>
  );

  const StudentCard = ({ item }) => (
    <TouchableOpacity
      onPress={() => toggleAbsence(item.student_id)}
      className={`mx-4 mb-3 rounded-xl border ${
        absentIds.includes(item.student_id)
          ? "bg-red-50 border-red-200"
          : "bg-green-50 border-green-200"
      } shadow-sm`}
    >
      <View className="p-4 flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-800">
            {item.first_name} {item.last_name}
          </Text>
          <Text className="text-gray-500 text-sm mt-1">{item.email}</Text>
          <Text className="text-gray-400 text-sm">ID: {item.student_id}</Text>
        </View>
        <View className="items-center">
          <Checkbox
            value={absentIds.includes(item.student_id)}
            onValueChange={() => toggleAbsence(item.student_id)}
            className="h-6 w-6"
            color={absentIds.includes(item.student_id) ? "#EF4444" : "#10B981"}
          />
          <Text className="text-sm text-gray-500 mt-1">
            {absentIds.includes(item.student_id) ? "Absent" : "Present"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (classInfoLoading || attendanceLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="text-gray-600 mt-4">Loading class information...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <Topbar title="Take Attendance" showBack={true} />
      
      {classInfo?.student_accounts?.length ? (
        <>
          <FlatList
            data={classInfo.student_accounts}
            ListHeaderComponent={AttendanceHeader}
            renderItem={({ item }) => <StudentCard item={item} />}
            keyExtractor={(item) => item.student_id?.toString() || Math.random().toString()}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
          
          <View className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
            <TouchableOpacity
              onPress={handleTakeAttendance}
              disabled={loading || classInfo.student_accounts.length === 0}
              className={`p-4 rounded-xl ${
                loading || classInfo.student_accounts.length === 0
                  ? "bg-gray-300"
                  : "bg-blue-500"
              }`}
            >
              {loading ? (
                <View className="flex-row justify-center items-center">
                  <ActivityIndicator size="small" color="#FFFFFF" />
                  <Text className="text-white ml-2">Submitting...</Text>
                </View>
              ) : (
                <Text className="text-white text-center font-semibold text-lg">
                  Submit Attendance
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View className="flex-1 justify-center items-center p-4">
          <Text className="text-xl text-gray-600 text-center">
            No students enrolled in this class
          </Text>
        </View>
      )}
    </View>
  );
};

export default TakeAttendance;
