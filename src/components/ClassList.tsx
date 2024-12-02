import { FlatList, Text, View, ActivityIndicator, ScrollView } from "react-native";
import { useState, useCallback, useEffect } from "react";
import { useGetClasses } from "../hooks/useGetClasses";
import ClassListItem from "./ClassListItem";

const ClassList = ({classes, loading, refetch}) => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, []);

  if (loading && !refreshing) {
    return (
      <View className="flex justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#4B5563" />
        <Text className="mt-4 text-xl text-gray-600">Loading...</Text>
      </View>
    );
  }

  const EmptyComponent = () => {
    return (
      <View className="flex justify-center items-center bg-gray-100">
      <Text className="mt-4 text-xl text-gray-600">No class found</Text>
      </View>
    );
  };

  return (
    <View className="w-full flex-1 p-4 bg-gray-100">
      <FlatList
        data={classes}
        renderItem={({ item }) => <ClassListItem currentClass={item} />}
        onRefresh={onRefresh}
        refreshing={refreshing}
        ListEmptyComponent={EmptyComponent}
      />
    </View>
  );
};

export default ClassList;
