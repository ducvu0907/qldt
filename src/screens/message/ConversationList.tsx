import React from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { useGetListConversation, ConversationItemData } from '../../hooks/useMessage';
import { formatDate } from '../../helpers';
import { useNavigation } from '@react-navigation/native';
import Topbar from '../../components/Topbar';

const ConversationItem = ({ item }: { item: ConversationItemData }) => {
  const navigation = useNavigation<any>();

  return (
    <TouchableOpacity 
      className="flex-row items-center p-4 border-b border-gray-100"
      onPress={() => navigation.navigate('ConversationDetails', { 
        conversationId: item.id,
        partnerId: item.Partner.id 
      })}
    >
      <Image 
        source={{ uri: item.Partner.avatar || 'https://avatar.iran.liara.run/username' }}
        className="w-12 h-12 rounded-full"
      />
      
      <View className="flex-1 ml-4">
        <View className="flex-row justify-between items-center">
          <Text className="font-semibold text-base text-gray-900">
            {item.Partner.username}
          </Text>
          <Text className="text-sm text-gray-500">
            {formatDate(new Date(item.LastMessage.created_at))}
          </Text>
        </View>
        
        <View className="flex-row items-center mt-1">
          <Text 
            numberOfLines={1} 
            className={`flex-1 text-sm ${
              item.LastMessage.unread === '1' ? 'text-gray-900 font-semibold' : 'text-gray-500'
            }`}
          >
            {item.LastMessage.message}
          </Text>
          {item.LastMessage.unread === '1' && (
            <View className="w-2 h-2 rounded-full bg-blue-500 ml-2" />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const ConversationList = () => {
  const { conversations, loading, refetch } = useGetListConversation('0', '20');
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

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
    </View>
  );
};

export default ConversationList;