import { View, Text, TextInput, TouchableOpacity, Pressable, Keyboard, SafeAreaView } from 'react-native';
import Logo from "../../components/Logo";
import { useState } from 'react';
import DropDownPicker from "react-native-dropdown-picker";
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { AUTH_SERVER_URL } from '../../types';
import { validateSignupInputs } from '../../helpers';
import Toast from 'react-native-toast-message';

export enum Roles {
  STUDENT = "STUDENT",
  TEACHER = "TEACHER",
}

export type SignupRequest = {
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  uuid: number, // confusing
  role: Roles | null, // default to student
}

const roles = [
  { label: "student", value: Roles.STUDENT, labelStyle: { color: "#000000" } },
  { label: "teacher", value: Roles.TEACHER, labelStyle: { color: "#000000" } },
];

const Signup = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<SignupRequest>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    uuid: 1,
    role: null
  });
  const navigation = useNavigation<any>();

  const handleChangeInput = (field: keyof SignupRequest, value: any) => { // FIXME: change any to fixed type
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSignUp = async () => {
    try {
      if (!validateSignupInputs(formData)) {
        return;
      }
      setLoading(true);
      
      const requestData: any = {
        "ho": formData.firstName,
        "ten": formData.lastName,
        "email": formData.email,
        "password": formData.password,
        "uuid": formData.uuid,
      };

      if (formData.role !== null) {
        requestData["role"] = formData.role;
      }

      const res = await fetch(`${AUTH_SERVER_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await res.json();

      if (data.status_code !== 1000) {
        throw new Error(data.message || "Unknown error occurred during signup");
      }

      // subsequent verification request
      const verifyCode = data.verify_code;
      const verifyRequest = {
        "email": formData.email,
        "verify_code": verifyCode,
      };

      const verifyRes = await fetch(`${AUTH_SERVER_URL}/check_verify_code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(verifyRequest),
      });

      const verifyData = await verifyRes.json();

      if (verifyData.code === 1000) {
        Toast.show({
          type: "success",
          text1: "Create account successfully",
        });
        navigation.navigate("Login");
      } else {
        throw new Error(verifyData.message || "Verification failed");
      }

    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: error.message
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
        <SafeAreaView>
          <View className="flex items-center mt-22 mb-10">
            <Logo />
          </View>

          <View className="w-full justify-center items-center px-8">
            <Text className="text-white text-4xl mb-12">Create an account</Text>
            <View className="w-full space-y-4 mb-6">
              <View className="flex flex-row">
                <TextInput
                  onFocus={() => setOpen(false)}
                  placeholder="First name"
                  value={formData.firstName}
                  onChangeText={(value) => handleChangeInput("firstName", value)}
                  placeholderTextColor="#ffffff80"
                  className="w-1/3 border-2 border-white text-2xl rounded-lg p-3 text-white mb-4 mr-4"
                />
                <TextInput
                  onFocus={() => setOpen(false)}
                  placeholder="Last name"
                  value={formData.lastName}
                  onChangeText={(value) => handleChangeInput('lastName', value)}
                  placeholderTextColor="#ffffff80"
                  className="flex-1 border-2 border-white text-2xl rounded-lg p-3 text-white mb-4"
                />
              </View>

              <TextInput
                onFocus={() => setOpen(false)}
                placeholder="Email"
                value={formData.email}
                onChangeText={(value) => handleChangeInput('email', value)}
                placeholderTextColor="#ffffff80"
                keyboardType="email-address"
                autoCapitalize="none"
                className="border-2 border-white text-2xl rounded-lg p-3 text-white w-full mb-4"
              />

              <View className="relative">
                <TextInput
                  onFocus={() => setOpen(false)}
                  placeholder="Password"
                  value={formData.password}
                  onChangeText={(value) => handleChangeInput('password', value)}
                  placeholderTextColor="#ffffff80"
                  secureTextEntry
                  className="border-2 border-white text-2xl rounded-lg p-3 text-white w-full mb-4"
                />
                <Icon
                  name="lock"
                  size={24}
                  color="white"
                  style={{ position: 'absolute', right: 12, top: 15 }}
                />
              </View>

              <DropDownPicker
                open={open}
                value={formData.role}
                items={roles}
                onOpen={() => Keyboard.dismiss()}
                setOpen={setOpen}
                setValue={(callback) => {
                  setFormData((prevState) => ({
                    ...prevState,
                    role: callback(prevState.role),
                  }));
                }}
                placeholder="Role"
                style={{
                  backgroundColor: 'transparent',
                  borderColor: 'rgba(255, 255, 255, 1.0)',
                  borderWidth: 2
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
                theme="LIGHT"
              />

            </View>

            <View className={`w-full items-center ${open ? 'mt-20' : 'mt-5'}`}>
              <TouchableOpacity
                className="bg-white w-2/5 py-4 rounded-full items-center mb-5"
                onPress={handleSignUp}
                disabled={loading}
              >
                <Text className="text-red-500 text-3xl font-bold">Sign up</Text>
              </TouchableOpacity>

              <TouchableOpacity className="items-center" onPress={() => navigation.goBack()}>
                <Text className="text-white text-xl underline italic">
                  Already have an account? Login
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </Pressable>
  );
};

export default Signup;