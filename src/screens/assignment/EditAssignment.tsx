import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, SafeAreaView, Pressable, Keyboard } from 'react-native';
import { useState, useContext } from 'react';
import Toast from 'react-native-toast-message';
import { RESOURCE_SERVER_URL } from '../../types';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../contexts/AuthContext';
import * as DocumentPicker from 'expo-document-picker';
import Topbar from '../../components/Topbar';

export interface EditAssignmentRequest {
  file?: any;
  token: string;
  assignmentId: string;
  deadline?: string;
  description?: string;
}

const EditAssignment = ({ route }) => {
  const { token } = useContext(AuthContext);
  const navigation = useNavigation();
  const { id, description, deadline } = route.params.assignment;
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<EditAssignmentRequest>({
    token: token || '',
    assignmentId: id,
    description: description || '',
    deadline: deadline,
  });

  const handlePickingFile = async () => {
    const file = await DocumentPicker.getDocumentAsync();
    if (file.canceled) return;
    handleChangeInput('file', file.assets[0]);
  };

  const handleChangeInput = (field: keyof EditAssignmentRequest, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEditAssignment = async () => {
    try {
      if (!formData.description && !formData.deadline && !formData.file) {
        Toast.show({
          type: "error",
          text1: "Please update at least one field",
          position: "bottom",
        });
        return;
      }

      setLoading(true);

      const form = new FormData();
      form.append("token", formData.token);
      form.append("assignmentId", formData.assignmentId);
      if (formData.deadline) {
        form.append("deadline", formData.deadline.slice(0, 23));
      }
      if (formData.description) {
        form.append("description", formData.description);
      }
      if (formData.file) {
        form.append("file", {
          uri: formData.file.uri,
          type: formData.file.mimeType,
          name: formData.file.name,
        });
      }

      const res = await fetch(`${RESOURCE_SERVER_URL}/edit_survey`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: form,
      });

      const data = await res.json();

      if (data.meta.code !== "1000") {
        throw new Error(data.meta.message || 'Failed to update assignment');
      }

      Toast.show({
        type: 'success',
        text1: 'Assignment updated successfully',
        position: "bottom",
      });

      navigation.goBack();

    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: error.message,
        position: "bottom",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <Topbar title="Edit Assignment" showBack={true} />
      
      <Pressable
        onPress={Keyboard.dismiss}
        className="flex-1 px-6 pt-6"
      >
        <View className="space-y-6">
          {/* File Upload Section */}
          <View className="space-y-2">
            <Text className="text-gray-600 text-sm font-medium ml-1">
              Assignment File
            </Text>
            <TouchableOpacity
              onPress={handlePickingFile}
              className="flex-row items-center justify-center space-x-2 bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
            >
              <Ionicons 
                name={formData.file ? "document" : "cloud-upload-outline"} 
                size={24} 
                color="#4F46E5"
              />
              <Text className="text-gray-700 text-base">
                {formData.file ? formData.file.name : 'Select new file'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Deadline Section */}
          <View className="space-y-2">
            <Text className="text-gray-600 text-sm font-medium ml-1">
              Submission Deadline
            </Text>
            <View className="flex-row items-center bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <Ionicons name="calendar-outline" size={24} color="#4F46E5" />
              <DateTimePicker
                value={formData.deadline ? new Date(formData.deadline) : new Date()}
                mode="date"
                is24Hour={true}
                display="default"
                onChange={(event, date) => {
                  if (date) {
                    handleChangeInput('deadline', date.toISOString());
                  }
                }}
                themeVariant="light"
                style={{ flex: 1, marginLeft: 8 }}
              />
            </View>
          </View>

          {/* Description Section */}
          <View className="space-y-2">
            <Text className="text-gray-600 text-sm font-medium ml-1">
              Description
            </Text>
            <TextInput
              placeholder="Enter assignment description"
              value={formData.description || ''}
              onChangeText={(value) => handleChangeInput('description', value)}
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
              className="bg-white border border-gray-200 rounded-xl p-4 text-base text-gray-700 shadow-sm"
              style={{ textAlignVertical: 'top' }}
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleEditAssignment}
            disabled={loading}
            className={`mt-6 bg-indigo-600 py-4 rounded-xl items-center ${loading ? 'opacity-70' : ''}`}
          >
            {!loading ? (
              <Text className="text-white text-base font-semibold">
                Update Assignment
              </Text>
            ) : (
              <ActivityIndicator color="white" />
            )}
          </TouchableOpacity>
        </View>
      </Pressable>
    </View>
  );
};

export default EditAssignment;