import { useContext, useState, useEffect } from "react";
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

export interface TakeAttendanceRequest {
  token: string;
  class_id: string;
  date: string; // yyyy-mm-dd, maybe be default to today
  attendance_list: string[]; // list of absent students id
}

const TakeAttendance = () => {
  const navigation = useNavigation();
  const [absentIds, setAbsentIds] = useState<string[]>([]); 
  const { token } = useContext(AuthContext);
  const { selectedClassId } = useContext(ClassContext);
  const { classInfo, loading: classInfoLoading } = useGetClassInfo(selectedClassId);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (classInfo && classInfo.student_accounts) {
      setAbsentIds([]);
    }
  }, [classInfo]);

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
      date: formatDate(new Date()),
      attendance_list: absentIds,
    };

    try {
      const res = await fetch(`${RESOURCE_SERVER_URL}/take_attendance`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(attendanceRequest)
      });
      const data = await res.json();

      if (data.meta.code !== 1000) {
        throw new Error(data.meta.message || "Error while taking attendance");
      }

      console.log("submitting attendance list today", data.data);

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
    setAbsentIds(prevAbsentIds => {
      if (prevAbsentIds.includes(studentId)) {
        return prevAbsentIds.filter(id => id !== studentId); // remove from absent list
      } else {
        return [...prevAbsentIds, studentId]; // add to absent list
      }
    });
  };

  return (
    <View className="flex-1">
      <Topbar title="Take Attendance" showBack={false}/>

      {classInfoLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <>
        <Text className="text-center text-2xl font-semibold my-4">Date: {formatDate(new Date())}</Text>
          {classInfo?.student_accounts?.length !== 0 ? (
            <FlatList
              data={classInfo?.student_accounts}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className={`mb-2 p-4 border rounded-md ${
                    absentIds.includes(item.student_id) ? 'bg-red-200' : 'bg-green-200'
                  }`}
                  onPress={() => toggleAbsence(item.student_id)}
                >
                  <View className="flex-row items-center justify-between">
                    <View>
                      <Text className="text-xl font-bold">{item.first_name} {item.last_name}</Text>
                      <Text className="text-lg text-gray-600">{item.email}</Text>
                      <Text className="text-lg text-gray-600">ID: {item.student_id}</Text>
                    </View>
                    <View className="flex-col justify-center items-center">
                    <Text className="mb-2">absent</Text>
                    <Checkbox
                      value={absentIds.includes(item.student_id)}
                      onValueChange={() => toggleAbsence(item.student_id)}
                    />
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.student_id?.toString() || Math.random().toString()}
              contentContainerStyle={{ paddingBottom: 16 }}
            />
          ) : (
            <Text className="text-center text-xl text-black">No students in this class</Text>
          )}

          <TouchableOpacity
            onPress={handleTakeAttendance}
            disabled={loading || absentIds.length === 0}
            className="bg-blue-500 p-4 rounded mt-4"
          >

            {!loading ? 
            <Text className="text-white text-center">Submit</Text> : 
            <ActivityIndicator size={20}color="#0000ff" />
            }

          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default TakeAttendance;
