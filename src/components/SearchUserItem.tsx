import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { UserSearchData } from "../screens/home/SearchUser";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

interface SearchUserItemProps {
  user: UserSearchData;
}

const SearchUserItem: React.FC<SearchUserItemProps> = ({ user }) => {
  const navigation = useNavigation<any>();
  
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? "bg-green-500" : "bg-gray-400";
  };

  return (
    <TouchableOpacity 
      onPress={() => navigation.navigate("UserProfile", { user_id: user.account_id })}
      className="w-full bg-gray-800 rounded-xl my-2 overflow-hidden border border-gray-700"
    >
      {/* Main Content Container */}
      <View className="p-4 flex-row items-center">
        {/* Avatar Circle */}
        <View className="h-12 w-12 rounded-full bg-blue-600 items-center justify-center">
          <Text className="text-white text-lg font-bold">
            {getInitials(user.first_name, user.last_name)}
          </Text>
        </View>

        {/* User Information */}
        <View className="flex-1 ml-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-bold text-white">
              {user.first_name} {user.last_name}
            </Text>
            
          </View>

          {/* Contact Details */}
          <View className="mt-1 flex-row items-center">
            <MaterialIcons name="email" size={14} color="#9CA3AF" />
            <Text className="text-sm text-gray-400 ml-1">
              {user.email || "No Email Available"}
            </Text>
          </View>
        </View>

        {/* Right Arrow */}
        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
      </View>

      {/* Bottom Info Bar */}
      <View className="px-4 py-2 bg-gray-900/50 flex-row items-center">
        <MaterialIcons name="verified-user" size={14} color="#9CA3AF" />
        <Text className="text-sm text-gray-400 ml-1">
          ID: {user.account_id || "N/A"}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default SearchUserItem;