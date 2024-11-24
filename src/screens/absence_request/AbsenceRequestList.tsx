import React, { useCallback } from 'react';
import { FlatList, View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import Topbar from "../../components/Topbar";
import { useGetAbsenceRequests } from "../../hooks/useGetAbsenceRequests";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

const AbsenceRequestListItem = ({ request }) => {
  const navigation = useNavigation<any>();

  return (
    <TouchableOpacity 
      onPress={() => navigation.navigate("AbsenceReview", { request })} 
      className="bg-white mx-4 my-2 p-4 rounded-lg shadow-md flex-row items-center justify-between"
    >
      <View className="flex-col">
        <Text className="text-lg font-bold text-gray-800">#{request.id}</Text>
        <Text className="text-base text-gray-600">{request.title || "No title"}</Text>
      </View>
      <Text className="text-blue-600 font-semibold">Review</Text>
    </TouchableOpacity>
  );
};

const AbsenceRequestList = () => {
  const { absenceRequests, loading, refetch } = useGetAbsenceRequests("PENDING");

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        await refetch();
      };
      fetchData();
    }, [])
  );

  return (
    <View className="flex-1 bg-gray-100">
      <Topbar title="Absence Requests" showBack={true} />
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      ) : absenceRequests?.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500 text-lg">No pending absence requests</Text>
        </View>
      ) : (
        <FlatList
          data={absenceRequests}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <AbsenceRequestListItem request={item}/>}
        />
      )}
    </View>
  );
};

export default AbsenceRequestList;