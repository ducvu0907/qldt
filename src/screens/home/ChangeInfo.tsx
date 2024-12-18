import React, { useContext, useState } from 'react';
import { View, Image, Text, TextInput, TouchableOpacity, ActivityIndicator, Pressable, Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Topbar from '../../components/Topbar';
import { AuthContext } from '../../contexts/AuthContext';
import Toast from 'react-native-toast-message';
import { AUTH_SERVER_URL } from '../../types';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useGetMyInfo } from '../../hooks/useGetMyInfo';
import { showToastError } from '../../helpers';

const ChangeInfo = () => {
  const { token } = useContext(AuthContext);
  const {user, loading: userInfoLoading} = useGetMyInfo();
  const [name, setName] = useState('');
  const [file, setFile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<any>();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setFile(result.assets[0]);
    }
  };

  const handleChangeInfo = async () => {
    if (!name.trim() && !file) {
      Toast.show({
        type: 'error',
        text1: 'Required field missing',
      });
      return;
    }

    try {
      setLoading(true);
      Keyboard.dismiss();

      const formData = new FormData();

      if (token) formData.append('token', token);

      // name field is always needed for some reason, so send default name as fallback
      if (name.trim()) {
        formData.append('name', name.trim())
      } else {
        formData.append("name", `${user.ho} ${user.ten}`);
      }

      if (file) {
        formData.append("file", {
          uri: file.uri,
          type: file.mimeType,
          name: file.fileName
        });
      }

      const response = await fetch(`${AUTH_SERVER_URL}/change_info_after_signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const data = await response.json();

      if (data.code !== "1000") {
        throw new Error(data.message || 'Failed to update information');
      }

      Toast.show({
        type: 'success',
        text1: "Change user info successfully"
      });

      navigation.popTo("Setting", {shouldRefetch: true});

    } catch (error: any) {
      showToastError(error)
    } finally {
      setLoading(false);
    }
  };

  if (userInfoLoading) {
    return (
      <View className="w-full h-full">
      <ActivityIndicator size={50} color={"black"}/>
      </View>
    );
  }

  return (
    <Pressable onPress={() => Keyboard.dismiss()} className="flex-1 bg-red-700">
        <Topbar title="Change Info" showBack={true} />

        <View className="flex p-5">
          <View className="mb-5">
          </View>

          <View className="mb-5">
            <Text className="text-white text-lg font-semibold mb-2">Profile Picture</Text>
            <Pressable
              onPress={pickImage}
              className="flex-row items-center bg-white/30 rounded-lg p-4"
            >
              <Icon name="image" size={20} color="white" />
              <Text className="text-white ml-3">
                {file ? 'Change Picture' : 'Select Picture'}
              </Text>
            </Pressable>
            {file && (
              <Image style={{width: 100, height: 100, marginTop: 20, alignSelf: 'center'}} source={{ uri: file.uri } } />
            )}
          </View>

          <TouchableOpacity
            className="bg-green-500 py-3 px-5 rounded-lg mt-5 items-center"
            onPress={handleChangeInfo}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-semibold text-lg">
                Update Info
              </Text>
            )}
          </TouchableOpacity>
        </View>
    </Pressable>
  );
};

export default ChangeInfo;
