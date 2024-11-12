import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import Logo from "../../components/Logo";
import { LoginRequest } from '../../services/auth';
import { useState } from 'react';
import { SignupRequest } from '../../services/auth';

const Login = () => {
  const [formData, setFormData] = useState<LoginRequest>({
    email: "",
    password: "",
    deviceId: 1, // FIXME: might change later
  });

  const handleChangeInput = (field: keyof SignupRequest, value: any) => { // TODO: change value to fixed type
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // FIXME: dummy function
  const handleLogin = () => {
    console.log("account signup", formData);
  };

  return (
    <View className="flex-1 bg-red-500 justify-center items-center px-6">
      <Logo size={150}/>
      <Text className="text-white text-xl font-semibold my-4">Welcome to Hust</Text>
      
      <View className="w-full space-y-4 mb-6">
        <View className="space-y-4">
          <TextInput 
            placeholder="Firstname" 
            value={formData.email}
            onChangeText={(value) => handleChangeInput("firstname", value)}
            placeholderTextColor="#ffffff80"
            className="border border-white/30 rounded p-3 text-white w-full" 
          />
          <TextInput 
            placeholder="Lastname"
            value={formData.password}
            onChangeText={(value) => handleChangeInput('lastname', value)}
            placeholderTextColor="#ffffff80" 
            className="border border-white/30 rounded p-3 text-white w-full" 
          />
        </View>
        
        <TextInput 
          placeholder="Email"
          value={formData.email}
          onChangeText={(value) => handleChangeInput('email', value)}
          placeholderTextColor="#ffffff80"
          keyboardType="email-address"
          autoCapitalize="none"
          className="border border-white/30 rounded p-3 text-white w-full" 
        />
        
        <TextInput 
          placeholder="Password"
          value={formData.password}
          onChangeText={(value) => handleChangeInput('password', value)}
          placeholderTextColor="#ffffff80"
          secureTextEntry 
          className="border border-white/30 rounded p-3 text-white w-full" 
        />

      </View>

      <View className={`w-full`}>
        <TouchableOpacity 
          className="bg-white w-full py-3 rounded-full items-center mb-4"
          onPress={handleLogin}
        >
          <Text className="text-red-500 font-semibold">Login</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
};

export default Login;