import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ClassStack from './ClassStack';
import AssignmentStack from './AssignmentStack';
import MaterialStack from './MaterialStack';
import AttendanceStack from './AttendanceStack';
import AbsenceRequestStack from './AbsenceRequestStack';

const Tab = createBottomTabNavigator();

const ClassTabs = () => {

  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Class"
        component={ClassStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Assignments"
        component={AssignmentStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="document-text" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Material"
        component={MaterialStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="folder" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Attendance"
        component={AttendanceStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="checkmark-done" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Absence"
        component={AbsenceRequestStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="alert-circle" size={size} color={color} />
          ),
        }}
      />

    </Tab.Navigator>
  );
};

export default ClassTabs;
