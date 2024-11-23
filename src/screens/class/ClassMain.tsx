import React, { useContext } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Topbar from "../../components/Topbar";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../contexts/AuthContext';

const MenuButton = ({ icon, label, onPress }) => (
  <TouchableOpacity
    className="flex-row items-center px-4 py-3 space-x-3"
    onPress={onPress}
  >
    <Ionicons name={icon} size={24} color="#4b5563" />
    <Text className="ml-2 text-gray-700 text-base">{label}</Text>
  </TouchableOpacity>
);

const ClassMain = () => {
  const { role } = useContext(AuthContext);
  const navigation = useNavigation();

  const menuItems = [
    ...(role === "LECTURER" ? [
      { icon: "create", label: "Edit Class", screen: "EditClass" },
    ] : []),
    { icon: "information-circle", label: "Class Information", screen: "ClassDetailsInfo" },
    { icon: "people", label: "Students", screen: "ViewStudents" },
    { icon: "book", label: "Materials", screen: "MaterialStack" },
    { icon: "document-text", label: "Assignments", screen: "AssignmentStack" },
    { icon: "calendar", label: "Attendance", screen: "AttendanceStack" },
    { icon: "time", label: "Absence Request", screen: "AbsenceRequestStack" },
  ];

  return (
    <View className="flex-1 bg-white">
      <Topbar title="Class Management" showBack={true} />
      
      <View className="flex-1 pt-2">
        <View className="border-2 border-gray-100">
          {menuItems.map((item, index) => (
            <React.Fragment key={item.label}>
              <MenuButton
                icon={item.icon}
                label={item.label}
                onPress={() => navigation.navigate(item.screen)}
              />
              {index < menuItems.length - 1 && (
                <View className="h-[2px] bg-gray-100 ml-[52px]" />
              )}
            </React.Fragment>
          ))}
        </View>
      </View>
    </View>
  );
};

export default ClassMain;