import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SearchStack from "./SearchStack";
import SettingStack from "./SettingStack";
import HomeStack from "./HomeStack";
import MessageStack from "./MessageStack";
import NotificationStack from "./NotificationStack";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { View, Text } from 'react-native';
import { useGetUnreadNotificationCount } from '../hooks/useNotification';

const Tab = createBottomTabNavigator();

const NotificationIcon = ({ color, size }: { color: string; size: number }) => {
  const { unreads } = useGetUnreadNotificationCount();
  
  return (
    <View>
      <Ionicons name="notifications" size={size} color={color} />
      {unreads > 0 && (
        <View className="absolute -top-1 -right-3 bg-red-500 rounded-full min-w-[16px] h-4 px-1 items-center justify-center">
          <Text className="text-white text-xs font-bold">
            {unreads > 99 ? '99+' : unreads}
          </Text>
        </View>
      )}
    </View>
  );
};

const MainTabs = () => {
  return (
    <Tab.Navigator 
      screenOptions={{ 
        headerShown: false,
        tabBarActiveTintColor: '#0066FF',
        tabBarInactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Message"
        component={MessageStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble-ellipses" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Notification"
        component={NotificationStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <NotificationIcon color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Setting"
        component={SettingStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabs;