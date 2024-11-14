import { useNavigation } from "@react-navigation/native";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from 'react-native-vector-icons/Ionicons';

interface TopbarProps {
  title: string;
  showBack: boolean;
}

const Topbar: React.FC<TopbarProps> = ({ title, showBack = false }) => {
  const navigation = useNavigation();

  return (
    <View className="w-full h-[150px] bg-red-700 flex-row items-center px-4 relative justify-center">
      <SafeAreaView>
        {showBack && (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="absolute left-2 z-10"
          >
            <Ionicons name="arrow-back" size={30} color="white" />
          </TouchableOpacity>
        )}

        <View className="flex-1 items-center">
          <Text className="text-white font-bold text-6xl">HUST</Text>
          <Text className="text-white text-xl">{title}</Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

export default Topbar;