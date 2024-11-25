import React, { useCallback } from 'react';
import { FlatList, View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import Topbar from "../../components/Topbar";
import { useGetAbsenceRequests } from "../../hooks/useGetAbsenceRequests";

const StatusBadge = ({ status }: { status: string }) => (
  <View className="bg-blue-100 px-3 py-1 rounded-full">
    <Text className="text-blue-600 text-sm font-medium">
      {status}
    </Text>
  </View>
);

const AbsenceRequestListItem = ({ request }) => {
  const navigation = useNavigation<any>();

  return (
    <TouchableOpacity 
      onPress={() => navigation.navigate("AbsenceReview", { request })}
      className="bg-white mx-4 my-2 p-4 rounded-xl shadow-sm border border-gray-100"
    >
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center">
          <Text className="text-sm font-semibold text-gray-500 mr-2">
            Request #{request.id}
          </Text>
          <StatusBadge status="Pending" />
        </View>
        <MaterialIcons name="chevron-right" size={24} color="#6B7280" />
      </View>
      
      <Text className="text-lg font-semibold text-gray-800 mb-3">
        {request.title || "Untitled Request"}
      </Text>
      
    </TouchableOpacity>
  );
};

const EmptyState = () => (
  <View className="flex-1 items-center justify-center p-6">
    <MaterialCommunityIcons 
      name="calendar-blank-outline" 
      size={48} 
      color="#9CA3AF" 
      style={{ marginBottom: 16 }}
    />
    <Text className="text-xl font-semibold text-gray-800 mb-2">
      No Pending Requests
    </Text>
    <Text className="text-gray-500 text-center">
      When team members submit absence requests, they'll appear here for review.
    </Text>
  </View>
);

const AbsenceRequestList = () => {
  const { absenceRequests, loading, refetch } = useGetAbsenceRequests("PENDING");

  // useFocusEffect(
  //   useCallback(() => {
  //     const fetchData = async () => {
  //       await refetch();
  //     };
  //     fetchData();
  //   }, [])
  // );

  return (
    <View className="flex-1 bg-gray-50">
      <Topbar title="Absence Requests" showBack={true} />
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="text-gray-500 mt-4">Loading requests...</Text>
        </View>
      ) : absenceRequests?.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={absenceRequests}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <AbsenceRequestListItem request={item} />}
          contentContainerClassName="py-2"
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default AbsenceRequestList;