import { Image, View, Text } from "react-native";
import { useGetUser } from "../hooks/useGetUser";
import { ActivityIndicator } from "react-native";
import { useLogout } from "../hooks/useLogout";

const Profile = () => {
  const { user, loading } = useGetUser();
  const {logout} = useLogout();

  if (loading) {
    return (
      <View>
        <ActivityIndicator size={50} color={"#000"}/>
      </View>
    );
  }

  if (user === null) {
    logout();
  }

  return (
    <View className="w-full bg-white items-center p-2 flex-row justify-around border-4 rounded-lg border-white">
      <Image
        source={{ uri: user.avatar !== null ? user.avatar : `https://avatar.iran.liara.run/username?username=${user.ho + user.ten}` }}
        className="w-24 h-24 rounded-full"
      />
      <View className="items-start">
        <Text className="text-xl font-semibold">Ten: {user.ho} {user.ten}</Text>
        <Text className="text-lg text-gray-500">Email: {user.email}</Text>
        <Text className="text-lg text-gray-500">Vai tro: {user.role}</Text>
        <Text className="text-lg text-gray-500">Status: {user.status}</Text>
      </View>
    </View>
  );
}

export default Profile;
