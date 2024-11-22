import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Topbar from '../../components/Topbar';
import LogoutButton from '../../components/LogoutButton';
import { useNavigation } from '@react-navigation/native';
import Profile from '../../components/Profile';

const Setting = () => {
  const navigation = useNavigation<any>();
  const [isEnabled, setIsEnabled] = useState(false);

  return (
    <View className="w-full h-full bg-red-700">
      <Topbar title="Setting" />
      <Profile />
      <View className="flex justify-center p-5 items-center">
        <View className="rounded-lg mb-3 flex flex-row items-center px-4 py-3">
          <Icon name="bell" size={20} color="white" />
          <Text className="text-white font-bold text-lg ml-4">Notification</Text>
          <Switch 
            value={isEnabled} 
            onValueChange={() => setIsEnabled(!isEnabled)} 
            ios_backgroundColor={"#b0b0b0"}
            style={{ marginLeft: 20 }}
          />
        </View>
        <TouchableOpacity 
          className="rounded-lg mb-3 flex flex-row items-center px-4 py-3"
          onPress={() => navigation.navigate("ChangePassword")}
        >
          <Icon name="key" size={20} color="white" />
          <Text className="text-white font-bold text-lg ml-4">Change Password</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className="rounded-lg mb-3 flex flex-row items-center px-4 py-3"
          onPress={() => navigation.navigate("ChangeInfo")}
        >
          <Icon name="user" size={20} color="white" />
          <Text className="text-white font-bold text-lg ml-4">Change Info</Text>
        </TouchableOpacity>
        <LogoutButton />
      </View>
    </View>
  );
};

export default Setting;
