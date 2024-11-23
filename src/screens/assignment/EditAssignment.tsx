import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, SafeAreaView, Pressable, Keyboard } from 'react-native';
import { useState, useContext } from 'react';
import Toast from 'react-native-toast-message';
import { RESOURCE_SERVER_URL } from '../../types';
import Ionicons from 'react-native-vector-icons/Ionicons';
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
};

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
    if (file.canceled) {
      return;
    }
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
          text1: "No fields given",
        });
        return;
      }

      setLoading(true);

      // request form
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

      console.log(form);
      const data = await res.json();

      if (data.meta.code !== "1000") {
        throw new Error(data.meta.message || 'Unknown error occurred while editing assignment');
      }

      Toast.show({
        type: 'success',
        text1: 'Assignment updated successfully',
      });

      navigation.goBack();

    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Pressable
      onPress={() => {
        Keyboard.dismiss();
      }}
      className="flex-1 bg-red-700 justify-between"
    >
      <SafeAreaView className="flex-1">
      <Topbar title="Edit assignment" showBack={true}/>
        <View className="px-4 flex-1 justify-center">
          <TouchableOpacity
            onPress={handlePickingFile}
            className="border-2 border-white rounded-lg p-3 w-full mb-4"
          >
            <Text className="text-white text-2xl text-center">
              {formData.file ? formData.file.name : 'Select new file'}
            </Text>
          </TouchableOpacity>

          <View className="flex-row items-center border-2 border-white rounded-xl py-2 mb-4">
            <Text className="text-white text-2xl ml-4">Deadline:</Text>
            <DateTimePicker
              value={formData.deadline ? new Date(formData.deadline) : new Date()}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={(event, date) => {
                if (date) {
                  handleChangeInput('deadline', date.toISOString());
                  console.log("date change: ", formData.deadline);
                }
              }}
              themeVariant="dark"
              style={{ flex: 1, marginRight: 16 }}
            />
          </View>

          <TextInput
            placeholder="Description"
            value={formData.description || ''}
            onChangeText={(value) => handleChangeInput('description', value)}
            placeholderTextColor="#ffffff80"
            className="border-2 border-white rounded-xl p-3 text-white text-2xl mb-4"
          />

          <TouchableOpacity
            onPress={handleEditAssignment}
            disabled={loading}
            className="bg-white py-4 rounded-full items-center mb-5 w-2/5 self-center"
          >
            {!loading ? (
              <Text className="text-3xl font-bold text-blue-600">Update</Text>
            ) : (
              <ActivityIndicator size={20} />
            )}
          </TouchableOpacity>

        </View>
      </SafeAreaView>
    </Pressable>
  );
};

export default EditAssignment;
