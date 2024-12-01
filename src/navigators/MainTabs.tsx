import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SearchStack from "./SearchStack";
import SettingStack from "./SettingStack";
import HomeStack from "./HomeStack";
import MessageStack from "./MessageStack";
import NotificationStack from "./NotificationStack";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { View, Text } from 'react-native';
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { AssignmentStudentStack } from "./AssignmentStudentStack";
import { NewThingContext } from "../contexts/NewThingContext";

const Tab = createBottomTabNavigator();

const NotificationIcon = ({ color, size, unreadNotifications }: { color: string; size: number, unreadNotifications: number }) => {

  return (
    <View>
      <Ionicons name="notifications" size={size} color={color} />
      {unreadNotifications > 0 && (
        <View className="absolute -top-1 -right-4 bg-red-500 rounded-full min-w-[16px] h-4 px-1 items-center justify-center">
          <Text className="text-white text-xs font-bold">
            {unreadNotifications > 99 ? '99+' : unreadNotifications}
          </Text>
        </View>
      )}
    </View>
  );
};

const MessageIcon = ({ color, size, numNewMessages }: { color: string; size: number, numNewMessages: number }) => {
  return (
    <View>
      <Ionicons name="chatbubble-ellipses" size={size} color={color} />
      {numNewMessages > 0 && (
        <View className="absolute -top-1 -right-4 bg-red-500 rounded-full min-w-[16px] h-4 px-1 items-center justify-center">
          <Text className="text-white text-xs font-bold">
            {numNewMessages > 99 ? '99+' : numNewMessages}
          </Text>
        </View>
      )}
    </View>
  );
};

const MainTabs = () => {
  const {role} = useContext(AuthContext);
  const {numNewMessages, unreadNotifications} = useContext(NewThingContext);

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
            <MessageIcon size={size} color={color} numNewMessages={numNewMessages}/>
          ),
        }}
      />
      <Tab.Screen
        name="Notification"
        component={NotificationStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <NotificationIcon color={color} size={size} unreadNotifications={unreadNotifications}/>
          ),
        }}
      />
      {role === "STUDENT" &&
        <Tab.Screen
          name="Assignment"
          component={AssignmentStudentStack}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="document" size={size} color={color} />
            ),
          }}
        />
      }
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