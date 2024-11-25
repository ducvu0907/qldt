import React, { useCallback, useContext, useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { useGetListConversation, ConversationItemData } from '../../hooks/useMessage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Topbar from '../../components/Topbar';
import { Ionicons } from '@expo/vector-icons';
import { SocketContext } from '../../contexts/SocketContext';

const ConversationItem = ({ item }: { item: ConversationItemData }) => {
  console.log(item);
  const navigation = useNavigation<any>();

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short', // e.g., "Mon"
      year: 'numeric', // e.g., "2024"
      month: 'short', // e.g., "Nov"
      day: 'numeric' // e.g., "26"
    });
  };

  return (
    <TouchableOpacity 
      className="flex-row items-center p-4 border-b border-gray-100"
      onPress={() => navigation.navigate('ConversationDetails', { conversationId: item.id, partnerId: item.partner.id })}
    >
      <Image 
        source={{ uri: item.partner.avatar || 'https://avatar.iran.liara.run/username' }}
        className="w-12 h-12 rounded-full"
      />
      
      <View className="flex-1 ml-4">
        <View className="flex-row justify-between items-center">
          <Text className="font-semibold text-base text-gray-900">
            {item.partner.name}
          </Text>
          <Text className="text-sm text-gray-500">
            {formatDate(item.last_message.created_at)}
          </Text>
        </View>
        
        <View className="flex-row items-center mt-1">
          <Text 
            numberOfLines={1} 
            className={`flex-1 text-sm ${
              item.last_message.unread === '1' ? 'text-gray-900 font-semibold' : 'text-gray-500'
            }`}
          >
            {item.last_message.message}
          </Text>
          {item.last_message.unread === '1' && (
            <View className="w-2 h-2 rounded-full bg-blue-500 ml-2" />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const ConversationList = () => {
  const { conversations, loading, refetch } = useGetListConversation('0', '100');
  const [refreshing, setRefreshing] = useState(false);
  const {receiveMessage} = useContext(SocketContext);
  const navigation = useNavigation<any>();

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  useEffect(() => {
    receiveMessage((message) => {
      console.log(message);
      refetch();
    });
  }, [receiveMessage]);

  if (loading && !conversations) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" className="text-blue-500" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <Topbar title='Messages'/>
      <FlatList
        data={conversations}
        renderItem={({ item }) => <ConversationItem item={item} />}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center p-8">
            <Text className="text-gray-500 text-center">
              No conversations yet. Start a new chat to begin messaging.
            </Text>
          </View>
        }
      />
      
      {/* Floating Action Button for New Message */}
      <TouchableOpacity
        onPress={() => navigation.navigate('CreateMessage')}
        className="absolute bottom-4 right-4 bg-blue-500 w-14 h-14 rounded-full justify-center items-center shadow-lg"
      >
        <Ionicons name="create" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default ConversationList;
