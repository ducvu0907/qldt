import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { StudentAccount } from "./ClassInfo";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';

const StudentListItem: React.FC<{ student: StudentAccount }> = ({ student }) => {
  const navigation = useNavigation<any>();
  
  // Get initials for avatar
  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  return (
    <TouchableOpacity
      className="bg-white rounded-lg shadow-sm mx-4 my-1 p-4 flex-row items-center"
      onPress={() => navigation.navigate("UserProfile", {user_id: student.account_id})}
    >
      {/* Avatar Circle */}
      <View className="h-12 w-12 rounded-full bg-blue-100 items-center justify-center">
        <Text className="text-blue-600 font-semibold text-lg">
          {getInitials(student.first_name, student.last_name)}
        </Text>
      </View>

      {/* Student Info */}
      <View className="flex-1 ml-4">
        <Text className="text-gray-900 text-lg font-medium">
          {student.first_name} {student.last_name}
        </Text>
        <View className="flex-row items-center mt-1">
          <Ionicons name="mail-outline" size={14} color="#6b7280" />
          <Text className="text-gray-500 text-sm ml-1">
            {student.email || "No email available"}
          </Text>
        </View>
      </View>

      {/* Student ID Badge */}
      <View className="bg-gray-100 px-2 py-1 rounded">
        <Text className="text-gray-600 text-xs">
          ID: {student.account_id?.slice(-6) || "N/A"}
        </Text>
      </View>
    </TouchableOpacity>
  );
};


export default StudentListItem;
