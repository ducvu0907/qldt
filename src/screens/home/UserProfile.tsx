import React from "react";
import { Image, View, Text, ActivityIndicator } from "react-native";
import { useGetOtherInfo } from "../../hooks/useGetOtherInfo";
import Topbar from "../../components/Topbar";
import { SafeAreaView } from "react-native-safe-area-context";

export interface UserDetails {
  id: number;
  ho: string;
  ten: string;
  name: string;
  email: string;
  role: string;
  status: string;
  avatar: string | null;
}

const UserProfile = ({ route }) => {
  const { user_id } = route.params;
  const { user, loading } = useGetOtherInfo(user_id);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size={50} color="#0284c7" />
      </SafeAreaView>
    );
  }

  if (user === null) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <Text className="text-center text-2xl font-semibold text-gray-600">
          User not found
        </Text>
      </SafeAreaView>
    );
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <Topbar title="User Profile" showBack={true} />
      
      <View className="flex-1 px-4">
        <View className="bg-white rounded-2xl shadow-sm mt-4 p-6">
          <View className="items-center mb-6">
            <Image
              source={{
                uri: user.avatar
                  ? user.avatar
                  : `https://avatar.iran.liara.run/username?username=${user.ho + user.ten}`,
              }}
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
            />
            <Text className="text-2xl font-bold mt-4">
              {user.ho} {user.ten}
            </Text>
            <View className={`px-3 py-1 rounded-full mt-2 ${getStatusColor(user.status)}`}>
              <Text className="text-sm font-medium">
                {user.status}
              </Text>
            </View>
          </View>

          <View className="space-y-4">
            <InfoItem
              label="Email"
              value={user.email}
              icon="📧"
            />
            <InfoItem
              label="Role"
              value={user.role}
              icon="👤"
            />
            <InfoItem
              label="Account ID"
              value={`#${user.id}`}
              icon="🔢"
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const InfoItem = ({ label, value, icon }) => (
  <View className="flex-row items-center p-4 bg-gray-50 rounded-lg">
    <Text className="text-lg mr-2">{icon}</Text>
    <View>
      <Text className="text-sm text-gray-500">{label}</Text>
      <Text className="text-base font-medium text-gray-900">{value}</Text>
    </View>
  </View>
);

export default UserProfile;