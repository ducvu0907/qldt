import { FlatList, Text, View, ActivityIndicator } from "react-native";
import { useState, useCallback } from "react";
import { useGetClasses } from "../hooks/useGetClasses";
import ClassListItem from "./ClassListItem";
import { useFocusEffect } from "@react-navigation/native";

const ClassList = () => {
  const { classes, loading, refetch } = useGetClasses();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  // refetch when gain focus - lets not over engineering data validation xd
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
        <ActivityIndicator size="large" color="#4B5563" />
        <Text className="mt-4 text-xl text-gray-600">Loading...</Text>
      </View>
    );
  }

  return (
    <View className="w-full h-full flex p-4 bg-gray-100">
      <FlatList
        data={classes}
        renderItem={({ item }) => <ClassListItem currentClass={item} />}
        onRefresh={onRefresh}
        refreshing={refreshing}
      />
    </View>
  );
};

export default ClassList;
