import { View, TouchableOpacity } from "react-native";
import Topbar from "../../components/Topbar";
import ClassList from "../../components/ClassList";
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useGetClasses } from "../../hooks/useGetClasses";

const Home = ({ route }) => {
  const { classes, loading, refetch } = useGetClasses();
  const navigation = useNavigation<any>();
  const { role } = useContext(AuthContext);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        await refetch();
      };
  
      if (route.params?.shouldRefetch) {
        fetchData();
      }
      navigation.setParams({shouldRefetch: false})
    }, [route.params?.shouldRefetch])
  );

  return (
    <View className="w-full flex-1 items-center bg-gray-100">
      <Topbar title={"Class List"} showBack={false} />

      <ClassList classes={classes} loading={loading} refetch={refetch}/>

      <TouchableOpacity
        onPress={() => {
          if (role === "STUDENT") {
            navigation.navigate("RegisterClass");
          } else if (role === "LECTURER") {
            navigation.navigate("CreateClass");
          }
        }}
        className="absolute bottom-5 right-5 bg-blue-600 w-16 h-16 rounded-full justify-center items-center shadow-lg"
      >
        <Icon name={role === "STUDENT" ? "book" : "plus"} size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default Home;
