import { View, Text, TextInput, TouchableOpacity, Pressable, Keyboard, SafeAreaView } from 'react-native';
import Logo from "../../components/Logo";
import { Roles } from '../../services/auth';
import { useState } from 'react';
import { SignupRequest } from '../../services/auth';
import DropDownPicker from "react-native-dropdown-picker";

const roles = [
  { label: "student", value: Roles.STUDENT, labelStyle: { color: "#000000" } },
  { label: "teacher", value: Roles.TEACHER, labelStyle: { color: "#000000" } },
];

const Signup = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<SignupRequest>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    uuid: 1, // not sure, might change later
    role: null
  });

  const handleChangeInput = (field: keyof SignupRequest, value: any) => { // FIXME: change any to fixed type
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // FIXME: remove dummy function
  const handleSignUp = () => {
    console.log("account signup", formData);
  };

  return (
    <SafeAreaView>
      <Pressable onPress={() => Keyboard.dismiss()}>
        <View className="w-full h-full bg-red-700 justify-around">
          <View className="flex items-center mt-32">
            <Logo />
          </View>

          <View className="w-full h-full justify-center items-center px-8">
            <Text className="text-white text-4xl mb-12">Create an account</Text>
            <View className="w-full space-y-4 mb-6">
              <View className="flex flex-row">
                <TextInput
                  placeholder="First name"
                  value={formData.firstName}
                  onChangeText={(value) => handleChangeInput("firstName", value)}
                  placeholderTextColor="#ffffff80"
                  className="w-1/3 border-2 border-white text-2xl rounded-lg p-3 text-white mb-4 mr-4"
                />
                <TextInput
                  placeholder="Last name"
                  value={formData.lastName}
                  onChangeText={(value) => handleChangeInput('lastName', value)}
                  placeholderTextColor="#ffffff80"
                  className="flex-1 border-2 border-white text-2xl rounded-lg p-3 text-white mb-4"
                />
              </View>

              <TextInput
                placeholder="Email"
                value={formData.email}
                onChangeText={(value) => handleChangeInput('email', value)}
                placeholderTextColor="#ffffff80"
                keyboardType="email-address"
                autoCapitalize="none"
                className="border-2 border-white text-2xl rounded-lg p-3 text-white w-full mb-4"
              />

              <TextInput
                placeholder="Password"
                value={formData.password}
                onChangeText={(value) => handleChangeInput('password', value)}
                placeholderTextColor="#ffffff80"
                secureTextEntry
                className="border-2 border-white text-2xl rounded-lg p-3 text-white w-full mb-4"
              />

              <DropDownPicker
                open={open}
                value={formData.role}
                items={roles}
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
                  color: 'rgba(255, 255, 255, 0.3)'
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
              >
                <Text className="text-red-500 text-3xl font-bold">Sign up</Text>
              </TouchableOpacity>

              <TouchableOpacity className="items-center">
                <Text className="text-white text-xl underline italic">
                  Already have an account? Login
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Pressable>
    </SafeAreaView>
  );
};

export default Signup;