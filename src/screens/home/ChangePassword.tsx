import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Pressable, Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Topbar from '../../components/Topbar';
import { AuthContext } from '../../contexts/AuthContext';
import Toast from 'react-native-toast-message';
import { AUTH_SERVER_URL } from '../../types';
import { useNavigation } from '@react-navigation/native';

const ChangePassword = () => {
  const { token } = useContext(AuthContext);
  const [oldPassword, setOldPassword] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigation = useNavigation<any>();

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword) {
      Toast.show({
        type: "error",
        text1: "all fields are required",
      });
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${AUTH_SERVER_URL}/change_password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          oldPassword,
          newPassword,
        }),
      });

      const data = await res.json();
      if (data.code !== 1000) {
        throw new Error(data.message || "an error occured while changing password");
      }

      Toast.show({
        type: "success",
        text1: data.message,
      });

      navigation.popTo("Home");

    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: error.message,
      });
      setOldPassword(null);
      setNewPassword(null);

    } finally {
      setLoading(false);
    }
  };

  return (
      <View className="w-full h-full bg-red-700">
        <Topbar title="Change Password" showBack={true} showSetting={false} />

        <View className="flex justify-center p-5 items-center">
          <View className="w-full mb-5">
            <Text className="text-white text-lg font-semibold mb-2">Old Password</Text>
            <View className="flex-row items-center bg-white/30 rounded-lg px-4 py-3">
              <Icon name="lock" size={20} color="white" />
              <TextInput
                secureTextEntry
                value={oldPassword || ''}
                onChangeText={setOldPassword}
                placeholder="Enter old password"
                placeholderTextColor="white"
                style={{
                  flex: 1,
                  color: 'white',
                  marginLeft: 10,
                  fontSize: 16,
                }}
              />
            </View>
          </View>

          <View className="w-full mb-5">
            <Text className="text-white text-lg font-semibold mb-2">New Password</Text>
            <View className="flex-row items-center bg-white/30 rounded-lg px-4 py-3">
              <Icon name="lock" size={20} color="white" />
              <TextInput
                secureTextEntry
                value={newPassword || ''}
                onChangeText={setNewPassword}
                placeholder="Enter new password"
                placeholderTextColor="white"
                style={{
                  flex: 1,
                  color: 'white',
                  marginLeft: 10,
                  fontSize: 16,
                }}
              />
            </View>
          </View>

          <TouchableOpacity
            style={{
              backgroundColor: '#FF4D4D',
              paddingVertical: 12,
              paddingHorizontal: 20,
              borderRadius: 8,
              marginTop: 20,
              width: '100%',
              alignItems: 'center',
            }}
            onPress={() => {handleChangePassword(); Keyboard.dismiss()}}
            disabled={loading}
          >
            {!loading ? <Text className="text-white font-semibold text-lg">Change Password</Text> : <ActivityIndicator />}
          </TouchableOpacity>
        </View>
      </View>
  );
};

export default ChangePassword;
