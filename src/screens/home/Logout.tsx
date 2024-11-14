import { useContext } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { AuthContext } from "../../contexts/AuthContext";
import * as SecureStore from "expo-secure-store";
import { SafeAreaView } from "react-native-safe-area-context";

const Logout = () => {
  const { setToken } = useContext(AuthContext);

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("access-token");
    setToken(null);
  }

  return (
    <SafeAreaView>
    <View>
      <TouchableOpacity onPress={handleLogout}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
    </SafeAreaView>
  );
}

export default Logout;