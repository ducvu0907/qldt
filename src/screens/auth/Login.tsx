import { View, Text, TextInput, TouchableOpacity, Pressable, Keyboard, SafeAreaView, ActivityIndicator } from 'react-native';
import Logo from "../../components/Logo";
import { useContext, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { AuthContext } from '../../contexts/AuthContext';
import Toast from 'react-native-toast-message';
import * as SecureStore from "expo-secure-store";
import { AUTH_SERVER_URL } from '../../types';
import { validateLoginInputs } from '../../helpers';

export type LoginRequest = {
  email: string,
  password: string,
  device_id: number,
  fcm_token: string | null
}

const Login = () => {
  const { setToken, setRole, setUserId, setEmail, fcmToken } = useContext(AuthContext);
  const [formData, setFormData] = useState<LoginRequest>({
    email: "",
    password: "",
    device_id: 1,
    fcm_token: null
  });
  const [loading, setLoading] = useState<boolean>(false);
  const navigation = useNavigation<any>();

  const handleChangeInput = (field: keyof LoginRequest, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogin = async () => {
    try {
      if (!validateLoginInputs(formData)) {
        return;
      }
      setLoading(true);

      const requestData: any = {
        "email": formData.email,
        "password": formData.password,
        "device_id": 1,
        "fcm_token": fcmToken,
      };

      console.log(requestData);
      const res = await fetch(`${AUTH_SERVER_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData) 
      });

      const data = await res.json();

      if (data.code !== "1000") {
        throw new Error(data.message || "Error while logging in");
      }

      const token = data.data.token;
      await SecureStore.setItemAsync("access-token", token);
      setToken(token);
      setRole(data.data.role);
      setUserId(data.data.id);
      setEmail(data.data.email);

    } catch(error: any) {
      Toast.show({
        type: "error",
        text1: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
      <Pressable onPress={() => Keyboard.dismiss()}>
        <View className="w-full h-full bg-red-700 justify-around">
        <SafeAreaView>
          <View className="flex items-center mt-22 mb-10">
            <Logo />
          </View>

          <View className="w-full justify-center items-center px-8">
            <Text className="text-white text-4xl mb-12">Welcome back</Text>
            <View className="w-full space-y-4 mb-6">
              <TextInput
                placeholder="Email"
                value={formData.email}
                onChangeText={(value) => handleChangeInput("email", value)}
                placeholderTextColor="#ffffff80"
                className="w-full border-2 border-white text-2xl rounded-lg p-3 text-white mb-4 mr-4"
              />
              <View className="relative">
                <TextInput
                  placeholder="Password"
                  value={formData.password}
                  onChangeText={(value) => handleChangeInput('password', value)}
                  placeholderTextColor="#ffffff80"
                  secureTextEntry
                  className="border-2 border-white text-2xl rounded-lg p-3 text-white w-full mb-4"
                />
                <Icon
                  name="lock"
                  size={24}
                  color="white"
                  style={{ position: 'absolute', right: 12, top: 15 }}
                />
              </View>

            </View>

            <View className={`w-full items-center`}>
              <TouchableOpacity
                className="bg-white w-2/5 py-4 rounded-full items-center mb-5"
                onPress={handleLogin}
                disabled={loading}
              >
                {!loading ? <Text className="text-red-500 text-3xl font-bold">Login</Text> : <ActivityIndicator />}
              </TouchableOpacity>

              <TouchableOpacity className="items-center" onPress={() => navigation.navigate("Signup")}>
                <Text className="text-white text-xl underline italic">
                  Don't have an account? Register
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
        </View>
      </Pressable>
  );
};

export default Login;