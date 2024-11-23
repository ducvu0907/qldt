import React, { useContext, useEffect, useState } from "react";
import { View, FlatList, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { StudentAccount } from "../../components/ClassInfo";
import { ClassContext } from "../../contexts/ClassContext";
import { useGetClassInfo } from "../../hooks/useGetClassInfo";
import StudentListItem from "../../components/StudentListItem";
import Topbar from "../../components/Topbar";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from '@expo/vector-icons';
import { AuthContext } from "../../contexts/AuthContext";

const ViewStudents = () => {
  const {role} = useContext(AuthContext);
  const navigation = useNavigation<any>();
  const [students, setStudents] = useState<StudentAccount[]>([]);
  const { selectedClassId } = useContext(ClassContext);
  const { classInfo, loading } = useGetClassInfo(selectedClassId || "");

  useEffect(() => {
    if (classInfo && classInfo.student_accounts) {
      setStudents(classInfo.student_accounts);
    }
  }, [classInfo]);

  return (
    <View className="flex-1">
      <Topbar title={"Student list"} showBack={true} />

      {role === "LECTURER" && <TouchableOpacity
        onPress={() => navigation.navigate("AddStudent")}
        className="absolute bottom-5 right-5 z-10 bg-blue-500 rounded-full p-3"
      >
        <AntDesign name="plus" size={24} color="white" />
      </TouchableOpacity>
      }

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <>
          {classInfo?.student_accounts?.length !== 0 ? (
            <FlatList
              data={students}
              renderItem={({ item }) => (
                <TouchableOpacity className="mb-1 mx-2">
                  <StudentListItem student={item} />
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.student_id?.toString() || Math.random().toString()}
              contentContainerStyle={{ paddingBottom: 16 }}
            />
          ) : (
            <Text className="text-center text-2xl text-black">No students</Text>
          )}
        </>
      )}
    </View>
  );
};

export default ViewStudents;