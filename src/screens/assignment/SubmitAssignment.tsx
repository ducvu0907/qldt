import { View, Text, TextInput, TouchableOpacity, Pressable, Keyboard, SafeAreaView, ActivityIndicator } from 'react-native';
import Logo from "../../components/Logo";
import { useState, useContext } from 'react';
import { RESOURCE_SERVER_URL } from '../../types';
import Toast from 'react-native-toast-message';
import Ionicons from "react-native-vector-icons/Ionicons";
import { AuthContext } from '../../contexts/AuthContext';
import * as DocumentPicker from 'expo-document-picker';

export interface SubmitAssignmentRequest {
  file: any;
  token: string;
  assignmentId: string;
  textResponse: string;
}

const SubmitAssignment = ({route, navigation}) => {
  const { token } = useContext(AuthContext);
  const {assignment} = route.params;
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<SubmitAssignmentRequest>({
    file: null,
    token: token || "",
    assignmentId: assignment.id || "",
    textResponse: "",
  });

  const handlePickingFile = async () => {
    const file = await DocumentPicker.getDocumentAsync();
    if (file.canceled) {
      return;
    }
    handleChangeInput("file", file.assets[0]);
  };

  const handleChangeInput = (field: keyof SubmitAssignmentRequest, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmitAssignment = async () => {
    try {
      if (!formData.textResponse.trim() && !formData.file) {
        Toast.show({
          type: "error",
          text1: "Please provide a response or file to submit.",
        });
        return;
      }

      setLoading(true);

      const form = new FormData();
      form.append("token", formData.token);
      form.append("assignmentId", formData.assignmentId);
      form.append("textResponse", formData.textResponse);

      if (formData.file.uri) {
        form.append("file", {
          uri: formData.file.uri,
          type: formData.file.mimeType,
          name: formData.file.name,
        });
      }

      const res = await fetch(`${RESOURCE_SERVER_URL}/submit_survey`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: form,
      });

      const data = await res.json();

      if (data.meta.code !== "1000") {
        throw new Error(data.meta.message || "Unknown error occurred while submitting assignment");
      }

      Toast.show({
        type: "success",
        text1: "Assignment submitted successfully",
      });

      navigation.goBack();

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
            <Text className="text-white text-4xl mb-12">Submit Assignment</Text>
            <View className="w-full space-y-4 mb-6">

              <TextInput
                placeholder="Response Text"
                value={formData.textResponse}
                onChangeText={(value) => handleChangeInput('textResponse', value)}
                placeholderTextColor="#ffffff80"
                multiline
                numberOfLines={4}
                className="border-2 border-white text-2xl rounded-lg p-3 text-white w-full mb-4"
              />

              <TouchableOpacity
                onPress={() => {
                  handlePickingFile();
                }}
                className="border-2 border-white rounded-lg p-3 w-full mb-4">
                <Text className="text-white text-2xl text-center">
                  {formData.file ? formData.file.name : "Select File"}
                </Text>
              </TouchableOpacity>
            </View>

            <View className="w-full items-center">
              <TouchableOpacity
                className="bg-white w-2/5 py-4 rounded-full items-center mb-5"
                onPress={handleSubmitAssignment}
                disabled={loading}
              >
                {!loading ? <Text className="text-blue-500 text-3xl font-bold text-center">Submit</Text> : <ActivityIndicator />}
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

export default SubmitAssignment;
