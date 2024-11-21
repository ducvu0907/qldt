import { View, Text, TextInput, TouchableOpacity, Pressable, Keyboard, SafeAreaView, ActivityIndicator } from 'react-native';
import Logo from "../../components/Logo";
import { useContext, useState } from 'react';
import DropDownPicker from "react-native-dropdown-picker";
import { useNavigation } from '@react-navigation/native';
import { validateClassInputs } from '../../helpers';
import Toast from 'react-native-toast-message';
import { RESOURCE_SERVER_URL } from '../../types';
import Ionicons from "react-native-vector-icons/Ionicons";
import { AuthContext } from '../../contexts/AuthContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import { formatDate } from '../../helpers';

export enum ClassTypes {
  LT = "LT",
  BT = "BT",
  LT_BT = "LT_BT",
}

export type ClassCreateRequest = {
  token: string,
  class_id: string, // 6 digits
  class_name: string,
  class_type: ClassTypes, // LT, BT, LT_BT
  start_date: Date,
  end_date: Date,
  max_student_amount: number, // < 50
};

const classTypes = [
  { label: "LT", value: ClassTypes.LT, labelStyle: { color: "#000000" } },
  { label: "BT", value: ClassTypes.BT, labelStyle: { color: "#000000" } },
  { label: "LT_BT", value: ClassTypes.LT_BT, labelStyle: { color: "#000000" } },
];

const CreateClass = () => {
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<ClassCreateRequest>({
    token: token || "",
    class_id: "",
    class_name: "",
    class_type: ClassTypes.LT,
    start_date: new Date(),
    end_date: new Date(),
    max_student_amount: 30, // default value
  });
  const navigation = useNavigation<any>();

  const handleChangeInput = (field: keyof ClassCreateRequest, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCreateClass = async () => {
    try {
      if (!validateClassInputs(formData)) {
        return;
      }
      setLoading(true);

      const requestData: any = {
        token: formData.token,
        class_id: formData.class_id,
        class_name: formData.class_name,
        class_type: formData.class_type,
        start_date: formatDate(formData.start_date),
        end_date: formatDate(formData.end_date),
        max_student_amount: formData.max_student_amount,
      };

      const res = await fetch(`${RESOURCE_SERVER_URL}/create_class`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await res.json();
      console.log(data);

      if (data.meta.code !== "1000") {
        throw new Error(data.meta.message || "Unknown error occurred while creating class");
      }

      Toast.show({
        type: "success",
        text1: "Class created successfully",
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
      setOpen(false);
    }}>
      <View className="w-full h-full bg-red-700 justify-around">
        <SafeAreaView style={{ flex: 1 }}>
          <View className="flex items-center mt-22 mb-10">
            <Logo />
          </View>

          <View className="w-full justify-center items-center px-8">
            <Text className="text-white text-4xl mb-12">Create a Class</Text>
            <View className="w-full space-y-4 mb-6">
              <TextInput
                onFocus={() => setOpen(false)}
                placeholder="Class ID"
                value={formData.class_id}
                onChangeText={(value) => handleChangeInput("class_id", value)}
                placeholderTextColor="#ffffff80"
                keyboardType="numeric"
                className="border-2 border-white text-2xl rounded-lg p-3 text-white w-full mb-4"
              />

              <TextInput
                onFocus={() => setOpen(false)}
                placeholder="Class Name"
                value={formData.class_name}
                onChangeText={(value) => handleChangeInput('class_name', value)}
                placeholderTextColor="#ffffff80"
                className="border-2 border-white text-2xl rounded-lg p-3 text-white w-full mb-4"
              />

              <DropDownPicker
                open={open}
                value={formData.class_type}
                items={classTypes}
                onOpen={() => Keyboard.dismiss()}
                setOpen={setOpen}
                setValue={(callback) => {
                  setFormData((prevState) => ({
                    ...prevState,
                    class_type: callback(prevState.class_type),
                  }));
                }}
                placeholder="Class Type"
                style={{
                  height: 55,
                  backgroundColor: 'transparent',
                  borderColor: 'rgba(255, 255, 255, 1.0)',
                  borderWidth: 2,
                  marginBottom: 12,
                }}
                textStyle={{
                  color: 'white',
                  fontSize: 24
                }}
                placeholderStyle={{
                  color: '#ffffff80'
                }}
                dropDownContainerStyle={{
                  backgroundColor: '#ffffff',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                }}
                theme="DARK"
              />

              <TextInput
                onFocus={() => setOpen(false)}
                placeholder="Max Students"
                value={formData.max_student_amount.toString()}
                onChangeText={(value) => handleChangeInput('max_student_amount', value)}
                placeholderTextColor="#ffffff80"
                keyboardType="numeric"
                className="border-2 border-white text-2xl rounded-lg p-3 text-white w-full mb-4"
              />

              <View className="flex-row items-center border-2 border-white rounded-lg py-2 w-full mb-4">
                <Text className="text-white text-2xl pl-3">Start Date:</Text>
                <DateTimePicker
                  value={formData.start_date}
                  mode="date"
                  is24Hour={true}
                  display="default"
                  onChange={(event, date) => {
                    if (date) {
                      setFormData((prevState) => ({
                        ...prevState,
                        start_date: date,
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

              <View className="flex-row items-center border-2 border-white rounded-lg py-2 w-full mb-4">
                <Text className="text-white text-2xl pl-3">End Date:</Text>
                <DateTimePicker
                  value={formData.end_date}
                  mode="date"
                  is24Hour={true}
                  display="default"
                  onChange={(event, date) => {
                    if (date) {
                      setFormData((prevState) => ({
                        ...prevState,
                        end_date: date,
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
            </View>

            <View className={`w-full items-center`}>
              <TouchableOpacity
                className="bg-white w-2/5 py-4 rounded-full items-center mb-5"
                onPress={handleCreateClass}
                disabled={loading}
              >
                {!loading ? <Text className="text-blue-500 text-3xl font-bold text-center">Create Class</Text> : <ActivityIndicator />}
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

export default CreateClass;