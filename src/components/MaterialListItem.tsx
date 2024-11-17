import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

export interface MaterialListItemData {
  id: number;
  class_id: string;
  material_name: string;
  description: string;
  material_type: string;
}

const MaterialListItem: React.FC<{ material: MaterialListItemData }> = ({ material }) => {
  const navigation = useNavigation<any>();

  return (
    <TouchableOpacity
      // TODO: not sure why but server doesn't return anything about the material xd, so can't navigate yet
      //onPress={() => navigation.navigate("MaterialDetails", { material_id: material.id })} 
      className="w-full p-4 bg-gray-600 rounded-lg shadow-lg my-2"
    >
      <Text className="text-2xl font-extrabold text-white text-center">
        {material.material_name}
      </Text>

      <View className="flex-row justify-between mt-2">
        <Text className="text-sm text-white opacity-80">
          Type: {material.material_type || "Unknown"}
        </Text>
        <Text className="text-sm text-white opacity-80">
          Class ID: {material.class_id || "N/A"}
        </Text>
      </View>

      <View className="mt-3 flex-row items-center justify-between">
        <Text className="text-sm text-white opacity-70">
          Description: {material.description || "No description available"}
        </Text>

        <Text className="text-sm font-semibold text-blue-400">
          View Details
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default MaterialListItem;
