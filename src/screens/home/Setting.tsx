import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Switch, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Topbar from '../../components/Topbar';
import LogoutButton from '../../components/LogoutButton';
import { useNavigation } from '@react-navigation/native';
import Profile from '../../components/Profile';

interface SettingItemProps {
  icon: string;
  title: string;
  onPress?: () => void;
  hasSwitch?: boolean;
  switchValue?: boolean;
  onToggle?: (value: boolean) => void;
}

const SettingItem: React.FC<SettingItemProps> = ({ 
  icon, 
  title, 
  onPress, 
  hasSwitch, 
  switchValue, 
  onToggle 
}) => (
  <TouchableOpacity 
    className="bg-white/10 rounded-xl mb-3 flex-row items-center px-5 py-4"
    onPress={onPress}
    disabled={hasSwitch}
  >
    <View className="w-8 h-8 bg-white/15 rounded-full items-center justify-center">
      <Icon name={icon} size={16} color="white" />
    </View>
    <Text className="text-white font-semibold text-base flex-1 ml-4">
      {title}
    </Text>
    {hasSwitch ? (
      <Switch 
        value={switchValue} 
        onValueChange={onToggle}
        ios_backgroundColor={"#4B5563"}
        trackColor={{ false: "#4B5563", true: "#10B981" }}
        thumbColor="white"
      />
    ) : (
      <Icon name="chevron-right" size={14} color="white" style={{ opacity: 0.5 }} />
    )}
  </TouchableOpacity>
);

const Setting = () => {
  const navigation = useNavigation<any>();
  const [isEnabled, setIsEnabled] = useState(false);

  return (
    <View className="flex-1 bg-gray-700">
      <Topbar title="Settings" />
      
      {/* Profile Section */}
      <ScrollView className="flex-1">
        <View className="p-4">
          <View className="bg-gray-800/50 rounded-2xl p-4 mb-6">
            <Profile />
          </View>

          {/* Settings Groups */}
          <View className="mb-6">
            <Text className="text-gray-400 text-sm font-medium mb-3 px-1">
              PREFERENCES
            </Text>
            <SettingItem 
              icon="bell" 
              title="Notifications"
              hasSwitch
              switchValue={isEnabled}
              onToggle={setIsEnabled}
            />
          </View>

          <View className="mb-6">
            <Text className="text-gray-400 text-sm font-medium mb-3 px-1">
              ACCOUNT SETTINGS
            </Text>
            <SettingItem 
              icon="key" 
              title="Change Password"
              onPress={() => navigation.navigate("ChangePassword")}
            />
            <SettingItem 
              icon="user" 
              title="Change Information"
              onPress={() => navigation.navigate("ChangeInfo")}
            />
          </View>

        </View>
      </ScrollView>

      {/* Logout Button */}
      <View className="p-4 border-t border-gray-800">
        <LogoutButton />
      </View>
    </View>
  );
};

export default Setting;