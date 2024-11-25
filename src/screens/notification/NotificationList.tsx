import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Image, RefreshControl, TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native'; // import useFocusEffect
import { useGetNotifications, useMarkNotificationAsRead, NotificationItemData, useGetUnreadNotificationCount } from '../../hooks/useNotification';
import { formatDate } from '../../helpers';
import Topbar from '../../components/Topbar';

const NotificationIcon = ({ type }: { type: string }) => {
  let iconColor = 'bg-blue-500';
  let icon = '📋';

  switch (type) {
    case 'ABSENCE':
      iconColor = 'bg-yellow-500';
      icon = '🏃';
      break;
    case 'ACCEPT_ABSENCE_REQUEST':
      iconColor = 'bg-green-500';
      icon = '✅';
      break;
    case 'REJECT_ABSENCE_REQUEST':
      iconColor = 'bg-red-500';
      icon = '❌';
      break;
    case 'ASSIGNMENT_GRADE':
      iconColor = 'bg-purple-500';
      icon = '📝';
      break;
  }

  return (
    <View className={`w-10 h-10 rounded-full ${iconColor} items-center justify-center`}>
      <Text className="text-xl">{icon}</Text>
    </View>
  );
};

const NotificationItem = ({ 
  item, 
  onPress 
}: { 
  item: NotificationItemData;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity 
      onPress={onPress}
      className={`flex-row p-4 border-b border-gray-200 ${
        item.status === 'UNREAD' ? 'bg-blue-50' : 'bg-white'
      }`}
    >
      <NotificationIcon type={item.type} />
      
      <View className="flex-1 ml-3">
        <View className="flex-row justify-between items-start">
          <Text className="text-base font-semibold text-gray-900 flex-1">
            {item.title_push_notification}
          </Text>
          <Text className="text-xs text-gray-500 ml-2">
            {formatDate(new Date(item.sent_time))}
          </Text>
        </View>
        
        <Text className="text-sm text-gray-600 mt-1">
          {item.message}
        </Text>

        {item.data?.image && (
          <Image 
            source={{ uri: item.data.image }} 
            className="w-full h-40 rounded-lg mt-2"
            resizeMode="cover"
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const NotificationList = () => {
  const { notifications, loading, getNotifications } = useGetNotifications('0', '20');
  const {getUnreadNotificationCount} = useGetUnreadNotificationCount();
  const [loadingMarkRead, setLoadingMarkRead] = useState(false);
  const { markNotificationAsRead } = useMarkNotificationAsRead();
  const navigation = useNavigation<any>();

  const handleNotificationPress = useCallback((notification: NotificationItemData) => {
    if (notification.status === 'UNREAD' && !loadingMarkRead) {
      setLoadingMarkRead(true);
      markNotificationAsRead(notification.id.toString())
        .then(() => {
          getNotifications();
          getUnreadNotificationCount();
        })
        .finally(() => {
          setLoadingMarkRead(false);
        });
    }
    navigation.navigate("NotificationDetails", { notification });
  }, [loadingMarkRead, markNotificationAsRead, getNotifications]);

  const renderItem = useCallback(({ item }: { item: NotificationItemData }) => (
    <NotificationItem 
      item={item} 
      onPress={() => handleNotificationPress(item)}
    />
  ), [handleNotificationPress]);

  useFocusEffect(
   useCallback(() => {
     getNotifications();
   }, [])
  );

  if (loading && !notifications) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <Topbar title='Notifications' />
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl 
            refreshing={loading} 
            onRefresh={getNotifications}
          />
        }
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center p-8">
            <Text className="text-gray-500 text-lg text-center">
              No notifications yet
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default NotificationList;
