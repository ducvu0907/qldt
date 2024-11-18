import { View, Text, ScrollView, Linking, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import Topbar from "../../components/Topbar";
import { MaterialIcons } from '@expo/vector-icons';
import { useContext, useState } from "react";
import Toast from "react-native-toast-message";
import { AuthContext } from "../../contexts/AuthContext";
import { RESOURCE_SERVER_URL } from "../../types";

const MaterialInfo = ({ route, navigation }) => {
  const {token} = useContext(AuthContext);
  const { material } = route.params;
  const [loading, setLoading] = useState<boolean>(false);

  const handleOpenLink = async () => {
    if (material.material_link) {
      const canOpen = await Linking.canOpenURL(material.material_link);
      if (canOpen) {
        await Linking.openURL(material.material_link);
      }
    }
  };

  const handleEdit = () => {
    navigation.navigate('EditMaterial', { material });
  };

  const handleDeleteMaterial = async () => {
    try {
      const res = await fetch(`${RESOURCE_SERVER_URL}/delete_material`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          material_id: material.id
        }),
      });

      const data = await res.json();
      if (data.code !== 1000) {
        throw new Error(data.message || "Error while deleting material");
      }

      Toast.show({
        type: "success",
        text1: "Material deleted succesfully"
      });

      navigation.goBack();

    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Material",
      "Are you sure you want to delete this material?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: handleDeleteMaterial }
      ]
    );
  };

  return (
    <View className="flex-1 bg-gray-800">
      <Topbar title="Material Details" showBack={true} />
      
      <ScrollView className="flex-1 px-4">
        <View className="bg-gray-700 rounded-xl shadow-xl my-4 overflow-hidden">
          <View className="bg-gray-600 p-5 border-b border-gray-500">
            <Text className="text-2xl font-bold text-white text-center">
              {material.material_name}
            </Text>
          </View>

          <View className="p-5 space-y-6">
            <View className="flex-row justify-between">
              <View className="flex-1 mr-2">
                <Text className="text-gray-400 text-sm mb-1">Type</Text>
                <View className="bg-gray-600 rounded-lg px-3 py-2">
                  <Text className="text-white font-medium">
                    {material.material_type || "Unknown"}
                  </Text>
                </View>
              </View>
              
              <View className="flex-1 ml-2">
                <Text className="text-gray-400 text-sm mb-1">Class ID</Text>
                <View className="bg-gray-600 rounded-lg px-3 py-2">
                  <Text className="text-white font-medium">
                    {material.class_id || "N/A"}
                  </Text>
                </View>
              </View>
            </View>

            <View>
              <Text className="text-gray-400 text-sm mb-1">Description</Text>
              <View className="bg-gray-600 rounded-lg p-3">
                <Text className="text-white leading-5">
                  {material.description || "No description available"}
                </Text>
              </View>
            </View>

            <View>
              <Text className="text-gray-400 text-sm mb-1">Material Link</Text>
              {material.material_link ? (
                <TouchableOpacity 
                  onPress={handleOpenLink}
                  className="bg-gray-600 rounded-lg p-3 flex-row items-center justify-between"
                >
                  <Text className="text-blue-400 flex-1 mr-2" numberOfLines={1}>
                    {material.material_link}
                  </Text>
                  <MaterialIcons name="open-in-new" size={20} color="#60A5FA" />
                </TouchableOpacity>
              ) : (
                <View className="bg-gray-600 rounded-lg p-3">
                  <Text className="text-gray-400">No link available</Text>
                </View>
              )}
            </View>

          </View>
        </View>
        
        <View className="p-5 space-y-4">
          <TouchableOpacity 
            onPress={handleEdit}
            className="bg-blue-600 rounded-lg p-3 flex-row items-center justify-center"
          >
            <Text className="text-white font-semibold text-lg">Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={handleDelete}
            className="bg-red-600 rounded-lg p-3 flex-row items-center justify-center mt-4"
          >
            {!loading ? <Text className="text-white font-semibold text-lg">Delete</Text> : <ActivityIndicator size={30}/>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default MaterialInfo;
