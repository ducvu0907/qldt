import React, { useContext } from "react";
import { Text, View, ScrollView, ActivityIndicator } from "react-native";
import { ClassContext } from "../contexts/ClassContext";
import { useGetClassInfo } from "../hooks/useGetClassInfo";

export interface StudentAccount {
  account_id?: string;
  last_name?: string;
  first_name?: string;
  email?: string;
  student_id?: number;
};

export interface ClassDetail {
  id?: number;
  class_id?: string;
  class_name?: string;
  schedule?: null;
  lecturer_id?: number;
  student_count?: number;
  attached_code?: null;
  class_type?: string;
  start_date?: string;
  end_date?: string;
  status?: string;
  student_accounts?: StudentAccount[];
}

const ClassInfo = () => {
  const { selectedClassId } = useContext(ClassContext);
  const { classInfo, loading } = useGetClassInfo(selectedClassId);

  if (loading) {
    return (
      <View className="w-full">
        <ActivityIndicator size={30} color={"white"} />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 p-4 bg-white">
      <Text className="text-4xl font-extrabold text-black">{classInfo?.class_name}</Text>

      <Text className="text-2xl text-black opacity-80 mt-2">{`Class ID: ${classInfo?.class_id}`}</Text>
      <Text className="text-2xl text-black opacity-80 mt-2">{`Class Type: ${classInfo?.class_type}`}</Text>
      <Text className="text-2xl text-black opacity-80 mt-2">{`Schedule: ${classInfo?.schedule || 'Not available'}`}</Text>
      <Text className="text-2xl text-black opacity-80 mt-2">{`Lecturer ID: ${classInfo?.lecturer_id || 'Not assigned'}`}</Text>
      <Text className="text-2xl text-black opacity-80 mt-2">{`Start Date: ${classInfo?.start_date}`}</Text>
      <Text className="text-2xl text-black opacity-80 mt-2">{`End Date: ${classInfo?.end_date}`}</Text>
      <Text className="text-2xl text-black opacity-80 mt-2">{`Student Count: ${classInfo?.student_count}`}</Text>
      <Text
        className={`text-2xl mt-2 font-semibold ${classInfo?.status === 'ACTIVE' ? 'text-green-400' : 'text-red-400'}`}
      >
        Status: {classInfo?.status}
      </Text>
    </ScrollView>
  );
};

export default ClassInfo;
