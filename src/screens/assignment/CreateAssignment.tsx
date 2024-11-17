import { View, Text, TextInput, TouchableOpacity, Pressable, Keyboard, SafeAreaView, ActivityIndicator } from 'react-native';
import Logo from "../../components/Logo";
import { useState, useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import { formatDateTime, validateAssignmentInputs } from '../../helpers';
import Toast from 'react-native-toast-message';
import Ionicons from "react-native-vector-icons/Ionicons";
import { AuthContext } from '../../contexts/AuthContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import { RESOURCE_SERVER_URL } from '../../types';

export interface CreateAssignmentRequest {
  file: File;
  token: string;
  classId: string;
  title: string;
  deadline: Date;
  description: string;
}

const CreateAssignment = () => {
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<CreateAssignmentRequest>({
    file: {} as File,
    token: token || "",
    classId: "",
    title: "",
    deadline: new Date(),
    description: "",
  });
  const navigation = useNavigation<any>();

  const handleChangeInput = (field: keyof CreateAssignmentRequest, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCreateAssignment = async () => {
    try {
      if (!validateAssignmentInputs(formData)) {
        return;
      }
      console.log("creating new assignment");
      setLoading(true);

      const requestData: any = {
        token: formData.token,
        class_id: formData.classId,
        title: formData.title,
        description: formData.description,
        deadline: formatDateTime(formData.deadline),
        file: formData.file,
      };

      const res = await fetch(`${RESOURCE_SERVER_URL}/create_survey`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await res.json();

      if (data.meta.code !== 1000) {
        throw new Error(data.meta.message || "Unknown error occurred while creating assignment");
      }

      Toast.show({
        type: "success",
        text1: "Assignment created successfully",
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
            <Text className="text-white text-4xl mb-12">Create an Assignment</Text>
            <View className="w-full space-y-4 mb-6">
              {/* Class ID */}
              <TextInput
                placeholder="Class ID"
                value={formData.classId}
                onChangeText={(value) => handleChangeInput('classId', value)}
                placeholderTextColor="#ffffff80"
                className="border-2 border-white text-2xl rounded-lg p-3 text-white w-full mb-4"
              />

              {/* Title */}
              <TextInput
                placeholder="Assignment Title"
                value={formData.title}
                onChangeText={(value) => handleChangeInput('title', value)}
                placeholderTextColor="#ffffff80"
                className="border-2 border-white text-2xl rounded-lg p-3 text-white w-full mb-4"
              />

              {/* Description */}
              <TextInput
                placeholder="Assignment Description"
                value={formData.description}
                onChangeText={(value) => handleChangeInput('description', value)}
                placeholderTextColor="#ffffff80"
                multiline
                numberOfLines={4}
                className="border-2 border-white text-2xl rounded-lg p-3 text-white w-full mb-4"
              />

              {/* Deadline Picker */}
              <View className="flex-row items-center border-2 border-white rounded-lg py-2 w-full mb-4">
                <Text className="text-white text-2xl pl-3">Deadline:</Text>
                <DateTimePicker
                  value={formData.deadline}
                  mode="date"
                  is24Hour={true}
                  display="default"
                  onChange={(event, date) => {
                    if (date) {
                      setFormData((prevState) => ({
                        ...prevState,
                        deadline: date,
                      }));
                    }
                  }}
                  themeVariant='dark'
                  style={{
                    flex: 1,
                    marginRight: 15,
                  }}
                />
              </View>

              {/* File Upload (Placeholder for File Picker) */}
              <TouchableOpacity
                onPress={() => {
                  // You can trigger file picker logic here
                }}
                className="border-2 border-white rounded-lg p-3 w-full mb-4">
                <Text className="text-white text-2xl text-center">
                  {formData.file.name ? formData.file.name : "Select File"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Submit Button */}
            <View className="w-full items-center">
              <TouchableOpacity
                className="bg-white w-2/5 py-4 rounded-full items-center mb-5"
                onPress={handleCreateAssignment}
                disabled={loading}
              >
                {!loading ? <Text className="text-blue-500 text-3xl font-bold text-center">Create</Text> : <ActivityIndicator />}
              </TouchableOpacity>

              {/* Back Button */}
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

export default CreateAssignment;
