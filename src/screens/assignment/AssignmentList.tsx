import { FlatList, Text, View, ActivityIndicator, TouchableOpacity } from "react-native";
import { useState, useCallback, useContext, useEffect } from "react";
import AssignmentItem from "../../components/AssignmentItem";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useGetAssignments } from "../../hooks/useGetAssignments";
import Topbar from "../../components/Topbar";
import Icon from 'react-native-vector-icons/FontAwesome';
import { AuthContext } from "../../contexts/AuthContext";

const AssignmentList = () => {
  const { role } = useContext(AuthContext);
  const { assignments, loading, refetch } = useGetAssignments();
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<any>();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  useFocusEffect(
   useCallback(() => {
     const fetchData = async () => {
       await refetch();
     };
     fetchData();
   }, [])
  );

  if (loading && !refreshing) {
    return (
      <View className="flex-1 bg-white">
        <Topbar title="Assignments" />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#6366F1" />
          <Text className="mt-4 text-base text-gray-500 font-medium">Loading assignments...</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <Topbar title="Assignments" showBack={true} />
      
      {assignments?.length === 0 ? (
        <View className="flex-1 justify-center items-center px-4">
          <Icon name="folder-open-o" size={48} color="#9CA3AF" />
          <Text className="mt-4 text-base text-gray-500 text-center">
            No assignments available yet
          </Text>
        </View>
      ) : (
        <FlatList
          data={assignments}
          renderItem={({ item }) => <AssignmentItem assignment={item} />}
          keyExtractor={(item) => item.id.toString()}
          onRefresh={onRefresh}
          refreshing={refreshing}
          contentContainerClassName="px-4 py-2"
          ItemSeparatorComponent={() => <View className="h-2" />}
        />
      )}

      {role === "LECTURER" && (
        <TouchableOpacity
          onPress={() => navigation.navigate("CreateAssignment")}
          className="absolute bottom-6 right-6 bg-indigo-500 rounded-full w-14 h-14 justify-center items-center shadow-lg"
        >
          <Icon name="plus" size={24} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default AssignmentList;
