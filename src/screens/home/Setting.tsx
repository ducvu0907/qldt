import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Topbar from '../../components/Topbar';
import LogoutButton from '../../components/LogoutButton';
import { useNavigation } from '@react-navigation/native';

const Setting = () => {
  const navigation = useNavigation<any>();

  return (
    <View className="w-full h-full bg-red-700">
      <Topbar title="Setting" showBack={true} showSetting={false} />

      <View className="flex justify-center p-5 items-center">
        <TouchableOpacity className="rounded-lg mb-3 flex flex-row items-center px-4 py-3">
          <Icon name="bell" size={20} color="white" />
          <Text className="text-white font-bold text-lg ml-4">Notification</Text>
        </TouchableOpacity>
        <TouchableOpacity className="rounded-lg mb-3 flex flex-row items-center px-4 py-3"
          onPress={() => navigation.navigate("ChangePassword")}
        >
          <Icon name="key" size={20} color="white" />
          <Text className="text-white font-bold text-lg ml-4">Change Password</Text>
        </TouchableOpacity>
        <LogoutButton />
      </View>
    </View>
  );
};

export default Setting;
