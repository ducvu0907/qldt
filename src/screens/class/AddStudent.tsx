import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Pressable, 
  Keyboard, 
  SafeAreaView, 
  ActivityIndicator 
} from 'react-native';
import Logo from "../../components/Logo";
import { useContext, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import Ionicons from "react-native-vector-icons/Ionicons";
import { AuthContext } from '../../contexts/AuthContext';
import { RESOURCE_SERVER_URL } from '../../types';
import { ClassContext } from '../../contexts/ClassContext';
import Topbar from '../../components/Topbar';

export interface AddStudentRequest {
  token: string;
  class_id: string;
  account_id: string;
}

const AddStudent = () => {
  const { token } = useContext(AuthContext);
  const { selectedClassId } = useContext(ClassContext);
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
          text1: "Please enter a student ID",
        });
        return;
      }
      
      setLoading(true);
      const res = await fetch(`${RESOURCE_SERVER_URL}/add_student`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: formData.token,
          class_id: formData.class_id,
          account_id: formData.account_id,
        }),
      });

      const data = await res.json();

      if (data.meta.code !== "1000") {
        throw new Error(data.data || "Unable to add student. Please try again.");
      }

      Toast.show({
        type: "success",
        text1: "Student added successfully"
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
    <Pressable 
      onPress={Keyboard.dismiss}
      className="flex-1"
    >
      <View className="flex-1 bg-slate-50">
        <Topbar title='Add Student' showBack={true}/>
          <View className="flex-1 px-6 pt-12">
            <Text className="text-slate-800 text-2xl font-semibold mb-2">
              Add Student
            </Text>
            <Text className="text-slate-500 mb-8">
              Enter the student's ID number to add them to your class
            </Text>

            <View className="space-y-4">
              <View>
                <TextInput
                  placeholder="Student ID"
                  value={formData.account_id}
                  onChangeText={(value) => handleChangeInput('account_id', value)}
                  placeholderTextColor="#94a3b8"
                  keyboardType="numeric"
                  className="bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-800 text-base"
                />
              </View>

              <TouchableOpacity
                className={`mt-6 rounded-lg py-3 px-4 ${loading ? 'bg-slate-300' : 'bg-blue-600'}`}
                onPress={handleAddStudent}
                disabled={loading}
              >
                <View className="flex-row justify-center items-center space-x-2">
                  {loading ? (
                    <ActivityIndicator color="#ffffff" />
                  ) : (
                    <>
                      <Text className="text-white font-semibold text-base">
                        Add Student
                      </Text>
                    </>
                  )}
                </View>
              </TouchableOpacity>
            </View>
          </View>
      </View>
    </Pressable>
  );
};

export default AddStudent;