import { View, TouchableOpacity } from "react-native";
import Topbar from "../../components/Topbar";
import ClassList from "../../components/ClassList";
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";

const Home = () => {
  const navigation = useNavigation<any>();
  const { role } = useContext(AuthContext);

  return (
    <View className="flex-1">
      <Topbar title={"Class List"} showBack={false} settingScreen={"Setting"} />

      <ClassList />

      <TouchableOpacity
        onPress={() => {
          if (role === "STUDENT") {
            navigation.navigate("RegisterClass");
          } else if (role === "LECTURER") {
            navigation.navigate("CreateClass");
          }
        }}
        className="absolute bottom-5 left-5 bg-blue-600 w-16 h-16 rounded-full justify-center items-center shadow-lg"
      >
        <Icon name={role === "STUDENT" ? "book" : "plus"} size={30} color="white" />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("SearchUser")}
        className="absolute bottom-5 right-5 bg-green-600 w-16 h-16 rounded-full justify-center items-center shadow-lg"
      >
        <Icon name="search" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default Home;
