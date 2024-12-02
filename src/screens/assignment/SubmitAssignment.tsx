import { View, Text, TextInput, TouchableOpacity, Pressable, Keyboard, SafeAreaView, ActivityIndicator } from 'react-native';
import Logo from "../../components/Logo";
import { useState, useContext } from 'react';
import { RESOURCE_SERVER_URL } from '../../types';
import Toast from 'react-native-toast-message';
import Ionicons from "react-native-vector-icons/Ionicons";
import { AuthContext } from '../../contexts/AuthContext';
import * as DocumentPicker from 'expo-document-picker';
import { useNavigation } from '@react-navigation/native';
import { showToastError } from '../../helpers';

export interface SubmitAssignmentRequest {
  file: any;
  token: string;
  assignmentId: string;
  textResponse: string;
}

const SubmitAssignment = ({ route }) => {
  const { token } = useContext(AuthContext);
  const navigation = useNavigation<any>();
  const { assignment } = route.params;
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
      form.append("assignmentId", formData.assignmentId.toString());
      form.append("textResponse", formData.textResponse);

      if (formData.file) {
        form.append("file", {
          uri: formData.file.uri,
          type: formData.file.mimeType,
          name: formData.file.name,
        });

      }

      console.log(form);
      const res = await fetch(`${RESOURCE_SERVER_URL}/submit_survey`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: form,
      });

      const data = await res.json();

      console.log(data);

      if (data.meta.code !== "1000") {
        throw new Error(data.data || "Error occurred while submitting assignment");
      }

      Toast.show({
        type: "success",
        text1: "Assignment submitted successfully",
      });

      navigation.popTo("AssignmentTabs", {shouldRefetch: true});

    } catch (error: any) {
      showToastError(error)
    } finally {
      setLoading(false);
    }
  };

  return (
    <Pressable onPress={() => { Keyboard.dismiss(); }} style={{ flex: 1 }}>
      <View className="bg-red-500 flex-1 justify-center p-6">
        <SafeAreaView style={{ flex: 1 }}>
          <View className="items-center mb-12">
            <Logo />
          </View>

          <Text className="text-white text-3xl font-semibold text-center mb-10">Submit Your Assignment</Text>

          <View className="space-y-6">
            <TextInput
              placeholder="Your response..."
              value={formData.textResponse}
              onChangeText={(value) => handleChangeInput('textResponse', value)}
              placeholderTextColor="#ffffff80"
              multiline
              numberOfLines={4}
              style={{
                borderColor: "#ffffff", 
                borderWidth: 1, 
                color: "#fff", 
                fontSize: 18, 
                borderRadius: 8, 
                padding: 12,
                textAlignVertical: "top"
              }}
            />

            <TouchableOpacity
              onPress={handlePickingFile}
              style={{
                borderColor: "#ffffff", 
                borderWidth: 1, 
                borderRadius: 8, 
                padding: 12, 
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: "#4A90E2",
                marginTop: 4
              }}
            >
              <Text className='text-white text-xl'>
                {formData.file ? formData.file.name : "Choose File"}
              </Text>
            </TouchableOpacity>
          </View>

          <View className="mt-12 items-center">
            <TouchableOpacity
              onPress={handleSubmitAssignment}
              disabled={loading}
              style={{
                backgroundColor: "#ffffff", 
                width: "60%", 
                paddingVertical: 14, 
                borderRadius: 50, 
                alignItems: "center", 
                justifyContent: "center",
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? (
                <ActivityIndicator size="large" color="#3b5998" />
              ) : (
                <Text style={{ fontSize: 20, color: "#3b5998", fontWeight: "bold" }}>
                  Submit
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ marginTop: 15 }}
            >
              <Ionicons name="arrow-back-outline" size={30} color="white" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </Pressable>
  );
};

export default SubmitAssignment;
