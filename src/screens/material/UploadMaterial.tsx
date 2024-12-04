import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ActivityIndicator, Pressable, Keyboard } from 'react-native';
import { useState, useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as DocumentPicker from 'expo-document-picker';
import { AuthContext } from '../../contexts/AuthContext';
import { RESOURCE_SERVER_URL } from '../../types';
import { ClassContext } from '../../contexts/ClassContext';
import Topbar from '../../components/Topbar';
import { showToastError } from '../../helpers';

export interface UploadMaterialRequest {
  file: any;
  token: string;
  classId: string;
  title: string;
  description: string;
  materialType: string;
}

const UploadMaterial = () => {
  const { token } = useContext(AuthContext);
  const { selectedClassId } = useContext(ClassContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<UploadMaterialRequest>({
    file: {} as File,
    token: token || "",
    classId: selectedClassId || "",
    title: "",
    description: "",
    materialType: "",
  });

  const navigation = useNavigation<any>();

  const handlePickingFile = async () => {
    const file = await DocumentPicker.getDocumentAsync();
    if (file.canceled) {
      return;
    }
    handleChangeInput("file", file.assets[0]);
    handleChangeInput("materialType", file.assets[0].mimeType);
  };

  const handleChangeInput = (field: keyof UploadMaterialRequest, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUploadMaterial = async () => {
    try {
      if (!formData.file.uri) {
        Toast.show({
          type: 'error',
          text1: 'No file uploaded',
        });
        return;
      }

      setLoading(true);
      
      const form = new FormData();
      form.append("token", formData.token);
      form.append("classId", formData.classId);
      form.append("title", formData.file.name);
      form.append("description", formData.description);
      form.append("materialType", formData.materialType);
      form.append("file", {
        uri: formData.file.uri,
        type: formData.file.mimeType,
        name: formData.file.name,
      });

      const res = await fetch(`${RESOURCE_SERVER_URL}/upload_material`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: form,
      });

      const data = await res.json();

      if (data.code !== "1000") {
        throw new Error(data.message || 'Unknown error occurred while uploading material');
      }

      Toast.show({
        type: 'success',
        text1: 'Material uploaded successfully',
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
      onPress={() => Keyboard.dismiss()} 
      className="flex-1 bg-slate-50 dark:bg-slate-900"
    >
      <Topbar title="Upload Material" showBack={true} />
      
      <View className="flex-1 px-6 py-8 space-y-8">
        <View className="space-y-2">
          <Text className="text-lg font-semibold text-slate-700 dark:text-slate-200">
            Course Material
          </Text>
          <TouchableOpacity
            onPress={handlePickingFile}
            className="border-2 border-dashed border-slate-300 dark:border-slate-600 
                     bg-white dark:bg-slate-800 rounded-xl p-6 
                     items-center justify-center min-h-[120px]"
          >
            {formData.file.name ? (
              <View className="items-center space-y-2">
                <Ionicons name="document-text" size={32} color="#6366f1" />
                <Text className="text-lg text-slate-700 dark:text-slate-200 text-center">
                  {formData.file.name}
                </Text>
                <Text className="text-sm text-slate-500 dark:text-slate-400">
                  Tap to change file
                </Text>
              </View>
            ) : (
              <View className="items-center space-y-2">
                <Ionicons name="cloud-upload" size={32} color="#6366f1" />
                <Text className="text-lg text-slate-700 dark:text-slate-200">
                  Select a file to upload
                </Text>
                <Text className="text-sm text-slate-500 dark:text-slate-400">
                  Tap to browse your files
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View className="space-y-2">
          <Text className="text-lg font-semibold text-slate-700 dark:text-slate-200">
            Description
          </Text>
          <TextInput
            placeholder="Add a description for this material..."
            placeholderTextColor="#94a3b8"
            value={formData.description}
            onChangeText={(value) => handleChangeInput('description', value)}
            className="bg-white dark:bg-slate-800 rounded-xl p-4 
                     text-base text-slate-700 dark:text-slate-200
                     border border-slate-200 dark:border-slate-700"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View className="pt-4">
          <TouchableOpacity
            onPress={handleUploadMaterial}
            disabled={loading}
            className={`bg-indigo-500 py-4 px-6 rounded-xl items-center
                      ${loading ? 'opacity-50' : 'active:bg-indigo-600'}`}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text className="text-white text-lg font-semibold">
                Upload Material
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Pressable>
  );
};

export default UploadMaterial;