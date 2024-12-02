import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Keyboard,
  Pressable,
  FlatList,
  Text,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { SocketContext } from '../../contexts/SocketContext';
import Topbar from '../../components/Topbar';
import { RESOURCE_SERVER_URL } from '../../types';
import { useNavigation } from '@react-navigation/native';
import { showToastError } from '../../helpers';

interface UserSearchData {
  account_id: string;
  last_name: string;
  first_name: string;
  email: string;
}

const CreateMessage = () => {
  const { sendMessage } = useContext(SocketContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<UserSearchData[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserSearchData | null>(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [scaleAnimation] = useState(new Animated.Value(1));
  const navigation = useNavigation<any>();

  const fetchUsers = async (query: string) => {
    if (!query.trim()) {
      setUsers([]);
      return;
    }

    setSearchLoading(true);
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
        throw new Error(data.meta.message || 'Search failed');
      }

      setUsers(data.data.page_content);
    } catch (error: any) {
      showToastError(error)
    } finally {
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (searchQuery) {
        fetchUsers(searchQuery);
      } else {
        setUsers([]); // Clear users when search is empty
      }
    }, 500);

    return () => clearTimeout(debounceTimeout);
  }, [searchQuery]);

  const animateSendButton = () => {
    Animated.sequence([
      Animated.timing(scaleAnimation, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnimation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleSend = async () => {
    try {
      if (!selectedUser || !message.trim()) {
        Toast.show({
          type: "error",
          text1: "Please select a recipient and enter a message"
        });
        return;
      }

      animateSendButton();
      setIsLoading(true);
      sendMessage(selectedUser.account_id, message);

      setMessage('');
      Keyboard.dismiss();
      navigation.popTo("ConversationList", {shouldRefetch: true});

    } catch (error: any) {
      showToastError(error)
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectUser = (user: UserSearchData) => {
    setSelectedUser(user);
    setSearchQuery('');
    setUsers([]);
    Keyboard.dismiss();
  };

  const clearSelectedUser = () => {
    setSelectedUser(null);
    setSearchQuery('');
    setUsers([]); // Clear users list when clearing selection
  };

  const canSend = message.trim().length > 0 && selectedUser !== null;

  const renderUserItem = ({ item }: { item: UserSearchData }) => (
    <Pressable
      onPress={() => handleSelectUser(item)}
      className="p-4 border-b border-gray-100 flex-row items-center"
    >
      <View className="flex-1">
        <Text className="text-base font-medium text-gray-900">
          {item.first_name} {item.last_name}
        </Text>
        <Text className="text-sm text-gray-500">{item.email}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="gray" />
    </Pressable>
  );

  return (
    <View className="flex-1 bg-white">
      <Topbar title='New Message' showBack={true} />

      <View className="flex-1">
        {/* Search Area */}
        <View className="p-4">
          {selectedUser ? (
            <View className="flex-row items-center bg-blue-50 p-3 rounded-lg">
              <View className="flex-1">
                <Text className="text-base font-medium text-blue-900">
                  To: {selectedUser.first_name} {selectedUser.last_name}
                </Text>
                <Text className="text-sm text-blue-700">{selectedUser.email}</Text>
              </View>
              <TouchableOpacity onPress={clearSelectedUser}>
                <Ionicons name="close-circle" size={24} color="#3B82F6" />
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2">
                <Ionicons name="search" size={20} color="gray" />
                <TextInput
                  placeholder="Search by name or email"
                  placeholderTextColor="gray"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  className="flex-1 ml-2 text-base text-gray-900"
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <Ionicons name="close-circle" size={20} color="gray" />
                  </TouchableOpacity>
                )}
              </View>
              {searchLoading && (
                <ActivityIndicator style={{ marginTop: 10 }} />
              )}
            </View>
          )}
        </View>

        {/* User List with enhanced visibility */}
        {!selectedUser && (
          <View className="flex-1 bg-gray-50">
            <FlatList
              data={users}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => handleSelectUser(item)}
                  className="p-4 border-b border-gray-200 bg-white mb-[1px] active:bg-gray-100"
                >
                  <View className="flex-1">
                    <Text className="text-base font-medium text-gray-900">
                      {item.first_name} {item.last_name}
                    </Text>
                    <Text className="text-sm text-gray-500">{item.email}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="gray" />
                </Pressable>
              )}
              keyExtractor={(item) => item.account_id}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingBottom: 100 }} // Add padding to prevent last item from being hidden
              ListEmptyComponent={
                <View className="flex-1 justify-center items-center bg-gray-50">
                  <Text className="text-lg text-gray-600">No users found</Text>
                </View>
              }
            />

          </View>
        )}

      </View>

      {/* Message Input Area - Always at bottom */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View className="px-4 py-2 bg-white border-t border-gray-200 shadow-sm">
          <View className="flex-row items-end space-x-2">
            <View className="flex-1 min-h-[40px] max-h-[120px] bg-gray-50 rounded-full px-4 py-2 border border-gray-200">
              <TextInput
                className="text-base text-gray-900 leading-5"
                placeholder="Aa"
                placeholderTextColor="#9CA3AF"
                value={message}
                onChangeText={setMessage}
                multiline
                maxLength={500}
                editable={!isLoading}
              />
            </View>

            <Animated.View
              style={{
                transform: [{ scale: scaleAnimation }],
              }}
            >
              <TouchableOpacity
                onPress={handleSend}
                disabled={isLoading || !canSend}
                className={`w-10 h-10 rounded-full justify-center items-center ml-2 
                ${!canSend
                    ? 'bg-gray-100'
                    : isLoading
                      ? 'bg-blue-300'
                      : 'bg-blue-500'}`}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="send"
                  size={20}
                  color={!canSend ? '#9CA3AF' : 'white'}
                  style={{ marginLeft: 2 }}
                />
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default CreateMessage;