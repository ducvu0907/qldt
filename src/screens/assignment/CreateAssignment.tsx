import { View, Text, TextInput, TouchableOpacity, Pressable, Keyboard, SafeAreaView, ActivityIndicator, Modal, Platform } from 'react-native';
import { useState, useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as DocumentPicker from 'expo-document-picker';
import Toast from 'react-native-toast-message';
import Ionicons from "react-native-vector-icons/Ionicons";

import Logo from "../../components/Logo";
import { AuthContext } from '../../contexts/AuthContext';
import { ClassContext } from '../../contexts/ClassContext';
import { formatDateTime, validateAssignmentInputs } from '../../helpers';
import { RESOURCE_SERVER_URL } from '../../types';

export interface CreateAssignmentRequest {
  file: any;
  token: string;
  classId: string;
  title: string;
  deadline: Date;
  description: string;
}

interface InputFieldProps {
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  multiline?: boolean;
  numberOfLines?: number;
}

const InputField = ({ value, onChangeText, placeholder, multiline = false, numberOfLines = 1 }: InputFieldProps) => (
  <TextInput
    value={value}
    onChangeText={onChangeText}
    placeholder={placeholder}
    placeholderTextColor="#ffffff80"
    multiline={multiline}
    numberOfLines={numberOfLines}
    className="border-2 border-white text-xl rounded-lg p-4 text-white w-full mb-4"
  />
);

const CreateAssignment = () => {
  const navigation = useNavigation<any>();
  const { token } = useContext(AuthContext);
  const { selectedClassId } = useContext(ClassContext);
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [formData, setFormData] = useState<CreateAssignmentRequest>({
    file: null,
    token: token || "",
    classId: selectedClassId || "",
    title: "",
    deadline: new Date(),
    description: "",
  });

  const handlePickingFile = async () => {
    const result = await DocumentPicker.getDocumentAsync();
    if (!result.canceled) {
      handleChangeInput("file", result.assets[0]);
    }
  };

  const handleChangeInput = (field: keyof CreateAssignmentRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || formData.deadline;
    
    // For Android, close the modal after selection
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    
    handleChangeInput('deadline', currentDate);
  };

  const handleCreateAssignment = async () => {
    if (!validateAssignmentInputs(formData)) return;

    try {
      setLoading(true);
      const form = new FormData();
      
      form.append("token", formData.token);
      form.append("classId", formData.classId);
      form.append("title", formData.title);
      form.append("description", formData.description);
      form.append("deadline", formatDateTime(formData.deadline));
      if (formData.file) {
        form.append("file", {
          uri: formData.file.uri,
          type: formData.file.mimeType,
          name: formData.file.name,
        });

      }
      console.log(form);
      const response = await fetch(`${RESOURCE_SERVER_URL}/create_survey`, {
        method: 'POST',
        headers: { 'Content-Type': 'multipart/form-data' },
        body: form,
      });

      const data = await response.json();

      if (data.meta.code !== "1000") {
        throw new Error(data.meta.message || "Failed to create assignment");
      }

      Toast.show({ type: "success", text1: "Assignment created successfully" });
      navigation.goBack();

    } catch (error: any) {
      Toast.show({ type: "error", text1: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Pressable onPress={Keyboard.dismiss} className="flex-1">
      <View className="flex-1 bg-red-600">
        <SafeAreaView className="flex-1">
          {/* Header */}
          <View className="items-center mt-8 mb-6">
            <Logo />
          </View>

          {/* Form Container */}
          <View className="flex-1 px-6">
            <Text className="text-white text-3xl font-bold mb-8 text-center">
              Create Assignment
            </Text>

            {/* Form Fields */}
            <View className="space-y-4">
              <InputField
                value={formData.title}
                onChangeText={(value) => handleChangeInput('title', value)}
                placeholder="Assignment Title"
              />

              <InputField
                value={formData.description}
                onChangeText={(value) => handleChangeInput('description', value)}
                placeholder="Assignment Description"
                multiline
                numberOfLines={4}
              />

              {/* Deadline Picker */}
              {Platform.OS === 'ios' ? (
                <View className="flex-row items-center border-2 border-white rounded-lg p-4">
                  <Text className="text-white text-xl mr-4">Deadline:</Text>
                  <DateTimePicker
                    value={formData.deadline}
                    mode="date"
                    is24Hour={true}
                    display="default"
                    onChange={handleDateChange}
                    themeVariant="dark"
                    style={{ flex: 1 }}
                  />
                </View>
              ) : (
                <TouchableOpacity 
                  onPress={() => setShowDatePicker(true)}
                  className="flex-row items-center border-2 border-white rounded-lg p-4"
                >
                  <Text className="text-white text-xl mr-4">Deadline:</Text>
                  <Text className="text-white text-xl">
                    {formData.deadline.toLocaleDateString()}
                  </Text>
                </TouchableOpacity>
              )}

              {/* Android Date Picker Modal */}
              {Platform.OS === 'android' && showDatePicker && (
                <Modal
                  transparent={true}
                  animationType="slide"
                  visible={showDatePicker}
                  onRequestClose={() => setShowDatePicker(false)}
                >
                  <View className="flex-1 justify-center items-center bg-black/50">
                      <DateTimePicker
                        value={formData.deadline}
                        mode="date"
                        is24Hour={true}
                        display="default"
                        onChange={handleDateChange}
                        themeVariant="light"
                      />
                  </View>
                </Modal>
              )}

              {/* File Picker */}
              <TouchableOpacity
                onPress={handlePickingFile}
                className="border-2 border-white rounded-lg mt-4 p-4"
              >
                <Text className="text-white text-xl text-center">
                  {formData.file || "Select File"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Action Buttons */}
            <View className="mt-8 items-center space-y-4">
              <TouchableOpacity
                className="bg-white w-40 py-4 rounded-full items-center"
                onPress={handleCreateAssignment}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#3B82F6" />
                ) : (
                  <Text className="text-blue-500 text-xl font-bold">Create</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => navigation.goBack()}
                className="p-2"
              >
                <Ionicons name="arrow-back-outline" size={28} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </Pressable>
  );
};

export default CreateAssignment;