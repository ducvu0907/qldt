import { FlatList, Text, View, ActivityIndicator, TouchableOpacity } from "react-native";
import { useState, useCallback, useContext } from "react";
import AssignmentResponseItem from "../../components/AssignmentResponseItem";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useGetAssignmentResponses } from "../../hooks/useGetAssignmentResponses";
import Topbar from "../../components/Topbar";
import { AuthContext } from "../../contexts/AuthContext";

const ViewResponses = ({route}) => {
  const { role } = useContext(AuthContext);
  const {assignment} = route.params;
  const { responses, loading, refetch } = useGetAssignmentResponses();
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<any>();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch(assignment.id);
    setRefreshing(false);
  }, [refetch]);

  // Refetch when gaining focus
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        await refetch(assignment.id);
      };
      fetchData();
    }, [refetch])
  );

  if (loading && !refreshing) {
    return (
      <View className="flex justify-center items-center bg-gray-100">
        <Topbar title="Assignment Responses" showBack={true} />
        <ActivityIndicator size="large" color="#4B5563" />
        <Text className="mt-4 text-xl text-gray-600">Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100">
      <Topbar title="Assignment Responses" showBack={true} />
      {responses?.length !== 0 ? (
        <FlatList
          data={responses}
          renderItem={({ item }) => <AssignmentResponseItem assignmentResponse={item} />}
          keyExtractor={(item) => item.id.toString()}
          onRefresh={onRefresh}
          refreshing={refreshing}
        />
      ) : (
        <Text className="mt-4 text-xl text-center text-gray-600">No responses found</Text>
      )}
      
      {role === "LECTURER" && (
        <TouchableOpacity
          onPress={() => navigation.navigate("GradeResponses")}
          className="absolute bottom-5 right-5 bg-blue-500 rounded-full p-4 shadow-lg"
        >
          <Text className="text-white text-xl">Grade Responses</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ViewResponses;
