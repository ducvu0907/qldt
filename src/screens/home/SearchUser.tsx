import React, { useState, useEffect } from "react";
import { View, FlatList, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { useNavigation } from '@react-navigation/native';
import Topbar from "../../components/Topbar";
import SearchUserItem from "../../components/SearchUserItem";
import { RESOURCE_SERVER_URL } from "../../types";
import Toast from "react-native-toast-message";

export interface UserData {
  account_id: string;
  last_name: string;
  first_name: string;
  email: string;
};

export interface SearchUserRequest {
  search: string;
}

const SearchUser = () => {
  const [users, setUsers] = useState<UserData[]>([]);
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
  
      if (!response.ok) {
        throw new Error('Server error. Please try again later.');
      }
  
      const data = await response.json();
  
      if (data.meta.code !== 1000) {
        throw new Error(data.meta.message || 'Search user failed');
      }
  
      setUsers(data.data);
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: error.message,
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (searchQuery.trim() !== "") {
      const timeoutId = setTimeout(() => {
        fetchUsers(searchQuery);
      }, 500);

      return () => clearTimeout(timeoutId);
    } else {
      setUsers([]);
    }
  }, [searchQuery]);

  return (
    <View className="flex-1">
      <Topbar title={"Search Users"} showBack={true} />

      <View className="p-4">
        <TextInput
          placeholder="Search by name"
          placeholderTextColor={"black"}
          value={searchQuery}
          onChangeText={setSearchQuery}
          className="w-full text-black border rounded text-2xl p-2 h-[50px]"
        />
      </View>

      {loading && <ActivityIndicator size={20} />}

      {error && <Text className="text-center text-red-500">{error}</Text>}

      <FlatList
        data={users}
        renderItem={({ item }) => (
            <SearchUserItem user={item} />
        )}
        keyExtractor={(item) => item.account_id}
        className="mb-1"
        ListEmptyComponent={
          !loading && !error ? (
            <Text className="text-center text-gray-500">No users found.</Text>
          ) : null
        }
      />
    </View>
  );
};

export default SearchUser;
