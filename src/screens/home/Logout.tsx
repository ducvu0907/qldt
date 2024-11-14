import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLogout } from "../../hooks/useLogout";

const Logout = () => {
  const { logout } = useLogout();

  return (
    <SafeAreaView>
    <View>
      <TouchableOpacity onPress={logout}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
    </SafeAreaView>
  );
}

export default Logout;