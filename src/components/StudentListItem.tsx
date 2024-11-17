import React from "react";
import { Pressable, Text, View } from "react-native";
import { StudentAccount } from "./ClassInfo";
import { useNavigation } from "@react-navigation/native";

const StudentListItem: React.FC<{ student: StudentAccount }> = ({ student }) => {
  const navigation = useNavigation<any>();
  return (
    <Pressable
      className="w-full p-4 bg-gray-600 rounded-lg shadow-lg my-2"
      onPress={() => navigation.navigate("UserProfile", {user_id: student.account_id})}
    >
      <Text className="text-2xl font-extrabold text-white text-center">
        {student.first_name} {student.last_name}
      </Text>

      <View className="flex-row justify-between mt-2">
        <Text className="text-sm text-white opacity-80">
          Email: {student.email || "No Email Available"}
        </Text>
        <Text className="text-sm text-white opacity-80">
          ID: {student.account_id || "N/A"}
        </Text>
      </View>

      <View className="mt-3 flex-row items-center justify-between">

      </View>
    </Pressable>
  );
};

export default StudentListItem;
