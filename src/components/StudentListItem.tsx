import React from "react";
import { Text, View } from "react-native";
import { StudentAccount } from "./ClassInfo";

const StudentListItem: React.FC<{ student: StudentAccount }> = ({ student }) => {
  return (
    <View
      className="w-full p-4 bg-gray-600 rounded-lg shadow-lg my-2"
    >
      <Text className="text-2xl font-extrabold text-white text-center">
        {student.first_name} {student.last_name}
      </Text>

      <View className="flex-row justify-between mt-2">
        <Text className="text-sm text-white opacity-80">
          {student.email || "No Email Available"}
        </Text>
        <Text className="text-sm text-white opacity-80">
          ID: {student.student_id || "N/A"}
        </Text>
      </View>

      <View className="mt-3 flex-row items-center justify-between">
        <Text className="text-sm text-white opacity-70">
          Status: {student.student_id ? "Enrolled" : "Not Enrolled"}
        </Text>

        <Text className="text-sm font-semibold text-blue-400">
          View Details
        </Text>
      </View>
    </View>
  );
};

export default StudentListItem;
