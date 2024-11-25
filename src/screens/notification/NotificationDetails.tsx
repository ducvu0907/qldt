import React, { useEffect } from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator } from 'react-native';
import { formatDate } from '../../helpers';
import Topbar from '../../components/Topbar';
import { useGetOtherInfo } from '../../hooks/useGetOtherInfo';

const NotificationStatusBadge = ({ status }: { status: string }) => (
  <View className={`px-3 py-1 rounded-full ${
    status === 'UNREAD' ? 'bg-blue-100' : 'bg-gray-100'
  }`}>
    <Text className={`text-sm ${
      status === 'UNREAD' ? 'text-blue-700' : 'text-gray-700'
    }`}>
      {status}
    </Text>
  </View>
);

const NotificationTypeIcon = ({ type }: { type: string }) => {
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
    <View className={`w-12 h-12 rounded-full ${iconColor} items-center justify-center mb-4`}>
      <Text className="text-2xl">{icon}</Text>
    </View>
  );
};

const NotificationDetails = ({ route }) => {
  const { notification } = route.params;
  const {loading, user: from_user} = useGetOtherInfo(notification.from_user);

  return (
    <View className="flex-1 bg-gray-50">
      <Topbar title="Notification Details" showBack={true}/>
      
      {!loading ? (<ScrollView className="flex-1">
        <View className="p-4 bg-white mb-2">
          <View className="items-center">
            <NotificationTypeIcon type={notification.type} />
            <Text className="text-xl font-semibold text-gray-900 text-center mb-2">
              {notification.title_push_notification}
            </Text>
            <NotificationStatusBadge status={notification.status} />
          </View>
        </View>

        <View className="p-4 bg-white mb-2">
          <View className="space-y-4">
            <View>
              <Text className="text-sm font-medium text-gray-500 mb-1">Message</Text>
              <Text className="text-base text-gray-900">{notification.message}</Text>
            </View>

            <View>
              <Text className="text-sm font-medium text-gray-500 mb-1">Time</Text>
              <Text className="text-base text-gray-900">
                {formatDate(new Date(notification.sent_time))}
              </Text>
            </View>

            <View>
              <Text className="text-sm font-medium text-gray-500 mb-1">From</Text>
              <Text className="text-base text-gray-900">{from_user.name}</Text>
            </View>

          </View>
        </View>


        {notification.data?.image && (
          <View className="p-4 bg-white mb-2">
            <Text className="text-sm font-medium text-gray-500 mb-2">Attached Image</Text>
            <Image
              source={{ uri: notification.data.image }}
              className="w-full h-64 rounded-lg"
              resizeMode="cover"
            />
          </View>
        )}

      </ScrollView>
      ) : (
        <ActivityIndicator size={24} color={"blue"} />
      ) }
    </View>
  );
};

export default NotificationDetails;