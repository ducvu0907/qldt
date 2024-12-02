import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Switch, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Topbar from '../../components/Topbar';
import LogoutButton from '../../components/LogoutButton';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Profile from '../../components/Profile';
import { useGetMyInfo } from '../../hooks/useGetMyInfo';

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
    className="bg-gray-200 rounded-xl mb-3 flex-row items-center px-5 py-4"
    onPress={onPress}
    disabled={hasSwitch}
  >
    <View className="w-8 h-8 bg-gray-300 rounded-full items-center justify-center">
      <Icon name={icon} size={16} color="#333" />
    </View>
    <Text className="text-gray-800 font-semibold text-base flex-1 ml-4">
      {title}
    </Text>
    {hasSwitch ? (
      <Switch 
        value={switchValue} 
        onValueChange={onToggle}
        ios_backgroundColor={"#ccc"}
        trackColor={{ false: "#ccc", true: "#4CAF50" }}
        thumbColor="white"
      />
    ) : (
      <Icon name="chevron-right" size={14} color="#999" style={{ opacity: 0.6 }} />
    )}
  </TouchableOpacity>
);

const Setting = ({route}) => {
  const navigation = useNavigation<any>();
  const { user, loading, refetch } = useGetMyInfo();
  const [isEnabled, setIsEnabled] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
          await refetch();
      };
  
      if (route.params?.shouldRefetch) {
        fetchData();
      }
    }, [route.params?.shouldRefetch])
  );

  return (
    <View className="flex-1 bg-white">
      <Topbar title="Settings" />
      
      {/* Profile Section */}
      <ScrollView className="flex-1">
        <View className="p-4">
          <View className="bg-gray-100 rounded-2xl p-4 mb-6">
            <Profile user={user} loading={loading}/>
          </View>

          {/* Settings Groups */}
          <View className="mb-6">
            <Text className="text-gray-600 text-sm font-medium mb-3 px-1">
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
            <Text className="text-gray-600 text-sm font-medium mb-3 px-1">
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
      <View className="p-4 border-t border-gray-300">
        <LogoutButton />
      </View>
    </View>
  );
};

export default Setting;
