import { View, Text, TextInput, TouchableOpacity, Pressable, Keyboard, SafeAreaView, ActivityIndicator } from 'react-native';
import Logo from "../../components/Logo";
import { useContext, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import Ionicons from "react-native-vector-icons/Ionicons";
import { AuthContext } from '../../contexts/AuthContext';
import { RESOURCE_SERVER_URL } from '../../types';
import { ClassContext } from '../../contexts/ClassContext';

export interface AddStudentRequest {
  token: string;
  class_id: string;
  account_id: string;
}

const AddStudent = () => {
  const { token } = useContext(AuthContext);
  const {selectedClassId} = useContext(ClassContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<AddStudentRequest>({
    token: token || "",
    class_id: selectedClassId || "",
    account_id: "",
  });
  const navigation = useNavigation<any>();

  const handleChangeInput = (field: keyof AddStudentRequest, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddStudent = async () => {
    try {
      if (!formData.account_id || !formData.class_id || !formData.token) {
        Toast.show({
          type: "error",
          text1: "All fields are required",
        });

        return;
      }
      setLoading(true);

      const requestData: AddStudentRequest = {
        token: formData.token,
        class_id: formData.class_id,
        account_id: formData.account_id,
      };

      const res = await fetch(`${RESOURCE_SERVER_URL}/add_student`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await res.json();

      if (data.meta.code !== "1000") {
        throw new Error(data.data || "Unknown error occurred while adding student");
      }

      Toast.show({
        type: "success",
        text1: "Add student successfully"
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
            <Text className="text-white text-4xl mb-12">Add a Student</Text>
            <View className="w-full space-y-4 mb-6">
              <TextInput
                placeholder="Student ID"
                value={formData.account_id}
                onChangeText={(value) => handleChangeInput('account_id', value)}
                placeholderTextColor="#ffffff80"
                keyboardType="numeric"
                className="border-2 border-white text-2xl rounded-lg p-3 text-white w-full mb-4"
              />
            </View>

            <View className={`w-full items-center`}>
              <TouchableOpacity
                className="bg-white w-2/5 py-4 rounded-full items-center mb-5"
                onPress={handleAddStudent}
                disabled={loading}
              >
                {!loading ? <Text className="text-blue-500 text-3xl font-bold text-center">Add</Text> : <ActivityIndicator />}
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

export default AddStudent;
