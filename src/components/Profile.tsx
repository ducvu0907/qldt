import { Image, View, Text } from "react-native";
import { useGetUser } from "../hooks/useGetUser";

const Profile = () => {
  const { user, loading } = useGetUser();

  return (
    <View className="w-full items-center p-4">
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <>
          <Image
            source={{ 
              uri: user.avatar !== null ? user.avatar : `https://avatar.iran.liara.run/username?username=${user.ho + user.ten}`
            }}
            className="w-24 h-24 rounded-full mb-4"
          />
          <View className="items-center">
            <Text className="text-lg font-semibold">{user.ho} {user.ten}</Text>
            <Text className="text-sm text-gray-500">{user.email}</Text>
          </View>
        </>
      )}
    </View>
  );
}

export default Profile;
