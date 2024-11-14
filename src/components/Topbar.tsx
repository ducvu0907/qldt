import React from "react";
import { useNavigation } from "@react-navigation/native";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";

interface TopbarProps {
  title: string;
  showBack: boolean;
  showSetting: boolean;
}

const Topbar: React.FC<TopbarProps> = ({ title, showBack, showSetting }) => {
  const navigation = useNavigation<any>();

  return (
    <View className="w-full h-[150px] bg-red-700">
      <SafeAreaView className="w-full h-full flex-row items-center justify-between">

        <View className="flex justify-center items-start flex-1 ml-2">
          {showBack && (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="arrow-back-outline" size={30} color="white" />
            </TouchableOpacity>
          )}
        </View>

        <View className="flex justify-center items-center mt-5">
          <Text className="text-white font-bold text-7xl shadow-lg shadow-black">HUST</Text>
          <Text className="text-white text-3xl">{title}</Text>
        </View>

        <View className="flex justify-center items-end flex-1">
          {showSetting && (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Setting");
              }}
            >
              <Icon name="ellipsis-vertical" size={30} color="white" />
            </TouchableOpacity>
          )}
        </View>

      </SafeAreaView>
    </View>
  );
};

export default Topbar;
