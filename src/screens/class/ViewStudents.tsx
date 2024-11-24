import React, { useContext, useEffect, useState } from "react";
import { View, FlatList, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { StudentAccount } from "../../components/ClassInfo";
import { ClassContext } from "../../contexts/ClassContext";
import { useGetClassInfo } from "../../hooks/useGetClassInfo";
import StudentListItem from "../../components/StudentListItem";
import Topbar from "../../components/Topbar";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from "../../contexts/AuthContext";

const ViewStudents = () => {
  const { role } = useContext(AuthContext);
  const navigation = useNavigation<any>();
  const [students, setStudents] = useState<StudentAccount[]>([]);
  const { selectedClassId } = useContext(ClassContext);
  const { classInfo, loading } = useGetClassInfo(selectedClassId || "");

  useEffect(() => {
    if (classInfo && classInfo.student_accounts) {
      setStudents(classInfo.student_accounts);
    }
  }, [classInfo]);

  const renderHeader = () => (
    <View className="bg-white px-4 py-3">
    </View>
  );

  const renderEmpty = () => (
    <View className="flex-1 justify-center items-center p-8">
      <Ionicons name="people-outline" size={48} color="#9ca3af" />
      <Text className="text-gray-600 text-lg mt-4 text-center">
        {"No students in this class yet"}
      </Text>
      <Text className="text-gray-500 text-base mt-2 text-center">
        {"Students added to this class will appear here"}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="text-gray-600 mt-4">Loading students...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <Topbar title="Student List" showBack={true} />

      {role === "LECTURER" && (
        <TouchableOpacity
          onPress={() => navigation.navigate("AddStudent")}
          className="absolute bottom-6 right-6 z-10 bg-blue-600 rounded-full w-14 h-14 items-center justify-center shadow-lg"
          style={{
            shadowColor: '#3b82f6',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 4.65,
            elevation: 8
          }}
        >
          <Ionicons name="add" size={28} color="white" />
        </TouchableOpacity>
      )}

      <FlatList
        data={students}
        renderItem={({ item }) => <StudentListItem student={item} />}
        keyExtractor={(item) => item.student_id?.toString() || Math.random().toString()}
        contentContainerStyle={{ 
          paddingVertical: 8,
          flexGrow: 1,
        }}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default ViewStudents;
