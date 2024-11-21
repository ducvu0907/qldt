import React, { useState, useEffect } from "react";
import { View, FlatList, Text, TextInput, ActivityIndicator, Pressable, Keyboard } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Topbar from "../../components/Topbar";
import SearchUserItem from "../../components/SearchUserItem";
import { RESOURCE_SERVER_URL } from "../../types";
import Toast from "react-native-toast-message";

export interface UserSearchData {
  account_id: string;
  last_name: string;
  first_name: string;
  email: string;
}

export interface SearchUserRequest {
  search: string;
}

const SearchUser = () => {
  const [users, setUsers] = useState<UserSearchData[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async (query: string) => {
    if (!query.trim()) {
      setUsers([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${RESOURCE_SERVER_URL}/search_account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          search: query
        }),
      });

      const data = await response.json();

      if (data.meta.code !== "1000") {
        throw new Error(data.meta.message || 'Search user failed');
      }

      setUsers(data.data.page_content);

    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: error.message,
      });
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchUser = () => {
    Keyboard.dismiss();
    fetchUsers(searchQuery);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setUsers([]);
    setError(null);
  };

  return (
    <Pressable onPress={() => Keyboard.dismiss()} className="flex-1 bg-white">
      <Topbar title={"Search Users"} showBack={true} />

      <View className="p-4">
        <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2">
          <Ionicons name="search" size={20} color="gray" className="mr-2" />
          <TextInput
            placeholder="Search by name"
            placeholderTextColor={"gray"}
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 text-black text-base"
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={clearSearch} className="ml-2">
              <Ionicons name="close-circle" size={20} color="gray" />
            </Pressable>
          )}
        </View>

        <Pressable
          onPress={handleSearchUser}
          className="mt-3 bg-blue-600 p-3 rounded-full items-center shadow-md"
        >
          <Text className="text-white text-base font-bold">Search Users</Text>
        </Pressable>
      </View>

      {loading && (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}

      {error && (
        <View className="p-4 bg-red-50 items-center">
          <Text className="text-red-600 text-center">{error}</Text>
        </View>
      )}

      <FlatList
        data={users}
        renderItem={({ item }) => (
          <SearchUserItem user={item} />
        )}
        keyExtractor={(item) => item.account_id}
        ListEmptyComponent={
          !loading && !error ? (
            <View className="items-center justify-center">
              <Ionicons name="search-outline" size={64} color="gray" />
              <Text className="text-gray-500 text-base mt-4 text-center">
                {searchQuery ? "No users found" : "Start searching for users"}
              </Text>
            </View>
          ) : null
        }
      />
    </Pressable>
  );
};

export default SearchUser;