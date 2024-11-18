import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

export interface MaterialListItemData {
  id: number;
  class_id: string;
  material_name: string;
  description: string;
  material_type: string;
  material_link: string | null;
}

const MaterialListItem: React.FC<{ material: MaterialListItemData }> = ({ material }) => {
  const navigation = useNavigation<any>();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("MaterialInfo", {material})} 
      className="w-full p-4 bg-gray-600 rounded-lg shadow-lg my-2"
    >
      <Text className="text-2xl font-extrabold text-white text-center">
        {material.material_name}
      </Text>

      <View className="mt-3 flex text-center items-center justify-between">
        <Text className="text-sm font-semibold text-blue-400">
          View Details
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default MaterialListItem;
