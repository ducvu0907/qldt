import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ClassStack from './ClassStack';
import AssignmentStack from './AssignmentStack';

const Tab = createBottomTabNavigator();

const ClassTabs = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="ClassStack"
        component={ClassStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="school" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="AssignmentStack"
        component={AssignmentStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="clipboard" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default ClassTabs;
