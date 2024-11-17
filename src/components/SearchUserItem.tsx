import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { UserSearchData } from "../screens/home/SearchUser";
import { useNavigation } from "@react-navigation/native";

const SearchUserItem: React.FC<{ user: UserSearchData }> = ({ user }) => {
  const navigation = useNavigation<any>();

  return (
      <TouchableOpacity onPress={() => navigation.navigate("UserProfile", {user_id: user.account_id})}
        className="w-full p-4 bg-gray-600 rounded-lg shadow-lg my-2">
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
      </TouchableOpacity>
  );
};

export default SearchUserItem;
