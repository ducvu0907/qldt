import { Image, View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import { useGetMyInfo } from "../hooks/useGetMyInfo";
import { ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";

const Profile = () => {
  const { user, loading } = useGetMyInfo();
  const navigation = useNavigation<any>();

  if (loading) {
    return (
      <View>
        <ActivityIndicator size={50} color={"#000"}/>
      </View>
    );
  }

  if (user === null) {
    return (
      <SafeAreaView className="flex justify-center items-center bg-white">
        <Text className="text-center text-2xl font-semibold text-gray-600">
          User not found
        </Text>
        <TouchableOpacity className="mt-2 bg-blue-400 rounded-full p-4" onPress={() => navigation.goBack()}>
        <Text>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }


  return (
    <View className="w-full bg-white items-center p-2 flex-row justify-around border-4 rounded-lg border-white">
      <Image
        source={{ uri: user.avatar !== null ? user.avatar : `https://avatar.iran.liara.run/username?username=${user.ho + user.ten}` }}
        className="w-12 h-12 rounded-full object-cover"
      />
        <View className="items-start">
          <Text className="text-xl font-semibold">{user.name}</Text>
          <Text className="text-lg text-gray-500">Email: {user.email}</Text>
          <Text className="text-lg text-gray-500">Role: {user.role}</Text>
          <Text className="text-lg text-gray-500">Status: {user.status}</Text>
        </View>
    </View>
  );
}

export default Profile;
