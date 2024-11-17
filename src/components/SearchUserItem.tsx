import React from "react";
import { Text, View } from "react-native";
import { UserData } from "../screens/home/SearchUser";

const SearchUserItem: React.FC<{ user: UserData }> = ({ user }) => {
  return (
    <View className="w-full p-4 bg-gray-600 rounded-lg shadow-lg my-2">
      <Text className="text-2xl font-extrabold text-white text-center">
        {user.first_name} {user.last_name}
      </Text>

      <View className="flex-row justify-between mt-2">
        <Text className="text-sm text-white opacity-80">
          {user.email || "No Email Available"}
        </Text>
        <Text className="text-sm text-white opacity-80">
          Account ID: {user.account_id || "N/A"}
        </Text>
      </View>

      <View className="mt-3 flex-row items-center justify-between">
        <Text className="text-sm text-white opacity-70">
          Status: {user.account_id ? "Active" : "Inactive"}
        </Text>

        <Text className="text-sm font-semibold text-blue-400">
          View Details
        </Text>
      </View>
    </View>
  );
};

export default SearchUserItem;
