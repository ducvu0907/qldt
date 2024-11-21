import { View, Text, TextInput, TouchableOpacity, Pressable, Keyboard, SafeAreaView, ActivityIndicator } from 'react-native';
import Logo from "../../components/Logo";
import { useContext, useEffect, useState } from 'react';
import DropDownPicker from "react-native-dropdown-picker";
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { RESOURCE_SERVER_URL } from '../../types';
import Ionicons from "react-native-vector-icons/Ionicons";
import { AuthContext } from '../../contexts/AuthContext';
import * as DocumentPicker from 'expo-document-picker';

export interface EditMaterialRequest {
  file?: any;
  materialId: string;
  title?: string;
  description?: string;
  materialType: string;
  token: string;
};

// FIXME: server-side not working i think
const EditMaterial = ({ route }) => {
  const {material} = route.params;
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<EditMaterialRequest>({
    token: token || "",
    materialId: material.id,
    title: material.material_name || "",
    materialType: material.material_type || "",
    description: material.description || "",
    file: null,
  });

  const navigation = useNavigation<any>();

  const handleChangeInput = (field: keyof EditMaterialRequest, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePickingFile = async () => {
    const file = await DocumentPicker.getDocumentAsync();
    if (file.canceled) {
      return;
    }
    handleChangeInput("file", file.assets[0]);
    handleChangeInput("materialType", file.assets[0].mimeType);
    handleChangeInput("title", file.assets[0].name);
  };

  const handleEditMaterial = async () => {
    try {
      if (!formData.file && !formData.description) {
        Toast.show({
          type: "error",
          text1: "No fields given"
        });
        return;
      }

      setLoading(true);

      const formDataObject = new FormData();
      if (formData.file) {
        formDataObject.append("file", {
          uri: formData.file.uri,
          type: formData.file.mimeType,
          name: formData.file.name,
        });
        formDataObject.append("materialType", formData.materialType);
      }
      formDataObject.append("token", formData.token);
      formDataObject.append("materialId", formData.materialId);
      if (formData.title) {
        formDataObject.append("title", formData.title);
      }
      if (formData.description) {
        formDataObject.append("description", formData.description);
      }

      const res = await fetch(`${RESOURCE_SERVER_URL}/edit_material`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formDataObject,
      });

      const data = await res.json();

      if (data.code !== "1000") {
        throw new Error(data.message || "Unknown error occurred while editing material");
      }

      console.log(data);

      Toast.show({
        type: "success",
        text1: "Material updated successfully",
      });

      navigation.popTo("MaterialList");

    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Pressable onPress={() => {
      Keyboard.dismiss();
    }}>
      <View className="w-full h-full bg-red-700 justify-around">
        <SafeAreaView style={{ flex: 1 }}>
          <View className="flex items-center mt-22 mb-10">
            <Logo />
          </View>

          <View className="w-full justify-center items-center px-8">
            <Text className="text-white text-4xl mb-12">Edit Material</Text>
            <View className="w-full space-y-4 mb-6">
              <TouchableOpacity
                onPress={handlePickingFile}
                className="h-[60px] bg-white p-3 rounded-lg mb-4 justify-center"
              >
                <Text className="text-black text-2xl text-center">
                  {formData.file ? formData.file.name : "Select File"}
                </Text>
              </TouchableOpacity>

              <TextInput
                placeholder="Description"
                value={formData.description || ""}
                onChangeText={(value) => handleChangeInput('description', value)}
                placeholderTextColor="#ffffff80"
                className="border-2 border-white text-2xl rounded-lg p-3 text-white w-full mb-4"
                multiline
                numberOfLines={3}
              />

            </View>

            <View className={`w-full items-center`}>
              <TouchableOpacity
                className="bg-white w-2/5 py-4 rounded-full items-center mb-5"
                onPress={handleEditMaterial}
                disabled={loading}
              >
                {!loading ? <Text className="text-blue-500 text-3xl font-bold text-center">Confirm</Text> : <ActivityIndicator size={20} />}
              </TouchableOpacity>

              <TouchableOpacity className="items-center" onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back-outline" size={30} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </Pressable>
  );
};

export default EditMaterial;
