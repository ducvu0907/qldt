import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/FontAwesome';

export interface MaterialListItemData {
  id: number;
  class_id: string;
  material_name: string;
  description: string;
  material_type: string;
  material_link: string | null;
}

const MaterialTypeIcon = ({ type }: { type: string }) => {
  const getIconDetails = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return { name: 'file-pdf-o', color: '#dc2626' };
      case 'doc':
      case 'docx':
        return { name: 'file-word-o', color: '#2563eb' };
      case 'ppt':
      case 'pptx':
        return { name: 'file-powerpoint-o', color: '#ea580c' };
      case 'xls':
      case 'xlsx':
        return { name: 'file-excel-o', color: '#16a34a' };
      default:
        return { name: 'file-o', color: '#6366f1' };
    }
  };

  const { name, color } = getIconDetails(type);
  return <Icon name={name} size={24} color={color} />;
};

const MaterialListItem: React.FC<{ material: MaterialListItemData }> = ({ material }) => {
  const navigation = useNavigation<any>();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("MaterialInfo", { material })}
      className="w-full bg-white dark:bg-slate-800 rounded-xl
                active:bg-slate-50 dark:active:bg-slate-700 transition-colors"
    >
      <View className="p-4">
        <View className="flex-row items-center space-x-3">
          <MaterialTypeIcon type={material.material_type} />
          <View className="flex-1 ml-2">
            <Text className="text-lg font-semibold text-slate-900 dark:text-white">
              {material.material_name}
            </Text>
          </View>
        </View>
        
        <View className="flex-row items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-slate-700">
          <Text className="text-sm font-medium text-indigo-500">
            View Details
          </Text>
          <Icon name="chevron-right" size={14} color="#6366f1" />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default MaterialListItem;