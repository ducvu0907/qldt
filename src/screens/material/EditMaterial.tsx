import { View, Text, TextInput, TouchableOpacity, Pressable, Keyboard, SafeAreaView, ActivityIndicator } from 'react-native';
import { useContext, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { RESOURCE_SERVER_URL } from '../../types';
import { MaterialIcons } from '@expo/vector-icons';
import { AuthContext } from '../../contexts/AuthContext';
import * as DocumentPicker from 'expo-document-picker';
import Topbar from '../../components/Topbar';
import { useGetMaterialInfo } from '../../hooks/useGetMaterialInfo';
import { useGetMaterials } from '../../hooks/useGetMaterials';
import { showToastError } from '../../helpers';

export interface EditMaterialRequest {
  file?: any;
  materialId: string;
  title?: string;
  description?: string;
  materialType: string;
  token: string;
}

const EditMaterial = ({ route }) => {
  const { material } = route.params;
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
    try {
      const file = await DocumentPicker.getDocumentAsync();
      if (file.canceled) {
        return;
      }
      handleChangeInput("file", file.assets[0]);
      handleChangeInput("materialType", file.assets[0].mimeType);
      handleChangeInput("title", file.assets[0].name);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error selecting file",
        text2: "Please try again"
      });
    }
  };

  const getFileTypeIcon = (mimeType: string) => {
    if (!mimeType) return 'insert-drive-file';
    if (mimeType.includes('pdf')) return 'picture-as-pdf';
    if (mimeType.includes('document')) return 'article';
    if (mimeType.includes('sheet')) return 'table-chart';
    if (mimeType.includes('presentation')) return 'slideshow';
    return 'insert-drive-file';
  };

  const handleEditMaterial = async () => {
    try {
      if (!formData.file && !formData.description) {
        Toast.show({
          type: "error",
          text1: "Please provide a file or description"
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
        throw new Error(data.message || "Error updating material");
      }

      Toast.show({
        type: "success",
        text1: "Material updated successfully",
      });

      navigation.popTo("MaterialList", {shouldRefetch: true});

    } catch (error: any) {
      showToastError(error)
    } finally {
      setLoading(false);
    }
  };

  return (
    <Pressable 
      onPress={Keyboard.dismiss}
      className="flex-1 bg-slate-50 dark:bg-slate-900"
    >
      <Topbar title="Edit Material" showBack={true}/>

      <SafeAreaView className="flex-1 px-4 py-6">
        <View className="space-y-6">
          {/* File Selection Section */}
          <View className="space-y-2">
            <Text className="text-sm font-medium text-slate-600 dark:text-slate-400 ml-2">
              Material File
            </Text>
            <TouchableOpacity
              onPress={handlePickingFile}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 
                        dark:border-slate-700 overflow-hidden active:bg-slate-50 dark:active:bg-slate-700"
            >
              <View className="p-4 flex-row items-center space-x-3">
                <View className="bg-indigo-100 dark:bg-slate-700 rounded-lg p-2">
                  <MaterialIcons 
                    name={formData.file ? getFileTypeIcon(formData.file.mimeType) : 'upload-file'} 
                    size={24} 
                    color="#6366f1"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-medium text-slate-900 dark:text-white" numberOfLines={1}>
                    {formData.file ? formData.file.name : "Select a file"}
                  </Text>
                  {formData.file && (
                    <Text className="text-sm text-slate-500 dark:text-slate-400">
                      {(formData.file.size / 1024 / 1024).toFixed(2)} MB
                    </Text>
                  )}
                </View>
                <MaterialIcons 
                  name={formData.file ? "edit" : "add"} 
                  size={20} 
                  color="#6366f1" 
                />
              </View>
            </TouchableOpacity>
          </View>

          {/* Description Section */}
          <View className="space-y-2">
            <Text className="text-sm font-medium text-slate-600 dark:text-slate-400 ml-1">
              Description
            </Text>
            <View className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 
                          dark:border-slate-700 overflow-hidden">
              <TextInput
                placeholder="Enter material description..."
                value={formData.description}
                onChangeText={(value) => handleChangeInput('description', value)}
                placeholderTextColor="#94a3b8"
                className="text-base text-slate-900 dark:text-white p-4"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="mt-auto space-y-4">
          <TouchableOpacity
            onPress={handleEditMaterial}
            disabled={loading}
            className="bg-indigo-500 rounded-lg p-4 flex-row items-center justify-center space-x-2
                      active:bg-indigo-600 disabled:opacity-50"
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <MaterialIcons name="save" size={20} color="white" />
                <Text className="text-white font-semibold text-base">
                  Save Changes
                </Text>
              </>
            )}
          </TouchableOpacity>

        </View>
      </SafeAreaView>
    </Pressable>
  );
};

export default EditMaterial;