import { Text, TouchableOpacity, View } from "react-native";
import { useLogout } from "../hooks/useLogout";
import Icon from 'react-native-vector-icons/FontAwesome';

const LogoutButton = () => {
  const { logout } = useLogout();

  return (
    <View>
      <TouchableOpacity className="rounded-lg mb-3 flex flex-row items-center px-4 py-3" onPress={logout}>
        <Icon name="sign-out" size={20} color="white" />
        <Text className="text-white font-bold text-lg ml-4">Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

export default LogoutButton;