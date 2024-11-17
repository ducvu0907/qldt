import React, { useContext, useEffect, useState } from "react";
import { View, FlatList, Text, TouchableOpacity } from "react-native";
import { StudentAccount } from "../../components/ClassInfo";
import { ClassContext } from "../../contexts/ClassContext";
import { useGetClassInfo } from "../../hooks/useGetClassInfo";
import StudentListItem from "../../components/StudentListItem";
import { useNavigation } from '@react-navigation/native';
import Topbar from "../../components/Topbar";

const ViewStudents = () => {
  const [students, setStudents] = useState<StudentAccount[]>([]);
  const { selectedClassId } = useContext(ClassContext);
  const { classInfo } = useGetClassInfo(selectedClassId || "");

  useEffect(() => {
    if (classInfo && classInfo.student_accounts) {
      setStudents(classInfo.student_accounts);
    }
  }, [classInfo]);

  return (
    <View className="flex-1 p-4">
      <Topbar title={"Student list"} showBack={true} />
      <Text className="text-2xl font-bold text-gray-800 mb-4">Students in Class</Text>

      <FlatList
        data={students}
        renderItem={({ item }) => (
          <TouchableOpacity className="mb-4">
            <StudentListItem student={item} />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.student_id?.toString() || Math.random().toString()}
        contentContainerStyle={{ paddingBottom: 16 }}
      />
    </View>
  );
};

export default ViewStudents;
