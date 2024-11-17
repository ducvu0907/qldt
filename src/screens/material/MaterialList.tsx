import { FlatList, Text, View, ActivityIndicator, TouchableOpacity } from "react-native";
import { useState, useCallback } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useGetMaterials } from "../../hooks/useGetMaterials";
import Topbar from "../../components/Topbar";
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialListItem from "../../components/MaterialListItem";

const MaterialList = () => {
  const { materials, loading, refetch } = useGetMaterials();
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<any>();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  // Refetch when gaining focus
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        await refetch();
      };
      fetchData();
    }, [refetch])
  );

  if (loading && !refreshing) {
    return (
      <View className="flex justify-center items-center bg-gray-100">
        <Topbar title="Materials" showBack={true} />
        <ActivityIndicator size="large" color="#4B5563" />
        <Text className="mt-4 text-xl text-gray-600">Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100">
      <Topbar title="Materials" showBack={true} />
      {materials?.length !== 0 ? (
        <FlatList
          data={materials}
          renderItem={({ item }) => <MaterialListItem material={item} />}
          keyExtractor={(item) => item.id.toString()}
          onRefresh={onRefresh}
          refreshing={refreshing}
        />
      ) : (
        <Text className="mt-4 text-xl text-center text-gray-600">No materials available</Text>
      )}
      <TouchableOpacity
        onPress={() => navigation.navigate("CreateMaterial")}
        className="absolute bottom-5 right-5 bg-blue-500 rounded-full p-4 shadow-lg"
      >
        <Icon name="plus" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default MaterialList;
