import { View, TouchableOpacity } from "react-native";
import Topbar from "../../components/Topbar";
import ClassList from "../../components/ClassList";
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Home = () => {
  const navigation = useNavigation<any>();

  return (
    <View className="flex-1">
      <Topbar title={"Class List"} showBack={false} settingScreen={"Setting"} />

      <ClassList />

      <TouchableOpacity
        onPress={() => navigation.navigate("CreateClass")}
        className="absolute bottom-5 right-5 bg-red-600 w-16 h-16 rounded-full justify-center items-center shadow-lg"
      >
        <Icon name="plus" size={30} color="white" />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("RegisterClass")}
        className="absolute bottom-5 left-5 bg-blue-600 w-16 h-16 rounded-full justify-center items-center shadow-lg"
      >
        <Icon name="book" size={30} color="white" />
      </TouchableOpacity>

    </View>
  );
};

export default Home;
