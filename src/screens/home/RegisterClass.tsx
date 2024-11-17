import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Pressable, Keyboard } from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';
import Toast from 'react-native-toast-message';
import { RESOURCE_SERVER_URL } from '../../types';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Topbar from '../../components/Topbar';

interface RegisterClassRequest {
  token: string,
  class_ids: string[],
};

const RegisterClass = () => {
  const { token } = useContext(AuthContext);
  const [classIdsInput, setClassIdsInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigation = useNavigation<any>();

  const handleRegisterClasses = async () => {
    const classIdsArray = classIdsInput
      .split(',')
      .map(id => id.trim())
      .filter(id => id.length > 0);

    if (classIdsArray.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Please enter at least one class ID',
      });
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${RESOURCE_SERVER_URL}/register_class`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          class_ids: classIdsArray,
        }),
      });

      const data = await res.json();
      if (data.meta.code !== 1000) {
        throw new Error(data.message || 'An error occurred while registering for classes');
      }

      Toast.show({
        type: 'success',
        text1: data.meta.message,
      });

      navigation.popTo('Home');

    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Pressable onPress={() => Keyboard.dismiss()} className="w-full h-full bg-red-700">
      <Topbar title="Register for Classes" showBack={true} />

      <View className="flex-1 p-5">

        <View className="mb-5">
          <Text className="text-white text-lg font-semibold mb-2">Enter Class IDs (separated by comma)</Text>
          <View className="flex-row items-center bg-white/30 rounded-lg px-4 py-3">
            <Icon name="book" size={20} color="white" />
            <TextInput
              value={classIdsInput}
              onChangeText={setClassIdsInput}
              placeholder="Enter class IDs"
              placeholderTextColor="white"
              className="w-full text-white text-xl ml-4"
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
          onPress={handleRegisterClasses}
          disabled={loading}
        >
          {!loading ? (
            <Text className="text-white font-semibold text-lg">Register for Classes</Text>
          ) : (
            <ActivityIndicator />
          )}
        </TouchableOpacity>
      </View>
    </Pressable>
  );
};

export default RegisterClass;
