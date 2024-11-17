import React, { useContext, useEffect, useState } from "react";
import { View, FlatList, Text, TouchableOpacity } from "react-native";
import { StudentAccount } from "../../components/ClassInfo";
import { ClassContext } from "../../contexts/ClassContext";
import { useGetClassInfo } from "../../hooks/useGetClassInfo";
import StudentListItem from "../../components/StudentListItem";
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
    <View className="flex-1">
      <Topbar title={"Student list"} showBack={true} />

      {classInfo?.student_accounts?.length !== 0 ?
      (
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

    </View>
  );
};

export default ViewStudents;
