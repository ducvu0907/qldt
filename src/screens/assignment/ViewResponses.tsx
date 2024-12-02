import { FlatList, Text, View, ActivityIndicator, TouchableOpacity } from "react-native";
import { useState, useCallback, useContext, useEffect } from "react";
import AssignmentResponseItem from "../../components/AssignmentResponseItem";
import { useNavigation } from "@react-navigation/native";
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

  useEffect(() => {
    refetch(assignment.id);
  }, []);

  if (loading && !refreshing) {
    return (
      <View className="flex justify-center items-center bg-gray-100">
        <Topbar title="Assignment Responses" showBack={true} />
        <ActivityIndicator size="large" color="#4B5563" />
        <Text className="mt-2 text-xl text-gray-600">Loading...</Text>
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
      
    </View>
  );
};

export default ViewResponses;
