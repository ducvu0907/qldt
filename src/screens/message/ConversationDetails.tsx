import React, { useContext, useRef, useState, useCallback, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, Pressable, Touchable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Topbar from '../../components/Topbar';
import { useDeleteMessage, useGetConversation } from '../../hooks/useMessage';
import { AuthContext } from '../../contexts/AuthContext';
import { SocketContext } from '../../contexts/SocketContext';
import Toast from 'react-native-toast-message';
import { formatDate } from '../../helpers';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { NewThingContext } from '../../contexts/NewThingContext';

const MessageBubble = React.memo(({ message, isOwnMessage, onDelete }) => {
  const [open, setOpen] = useState(false);

  const bubbleStyle = isOwnMessage
    ? 'bg-blue-500 self-end'
    : 'bg-gray-200 self-start';
  const textStyle = isOwnMessage
    ? 'text-white'
    : 'text-gray-800';

  const handleDelete = () => {
    Alert.alert(
      "Delete Message",
      "Are you sure you want to delete this message?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: () => onDelete(message.message_id),
          style: "destructive"
        }
      ]
    );
  };

  return (
    <Pressable onPress={() => setOpen(!open)} className={`mb-2`}>
      <View className={`rounded-lg px-4 py-2 ${bubbleStyle}`}>
        {message.message !== null ? <Text className={`${textStyle} text-lg`}>{message.message}</Text> :
          <Text className={`${textStyle} italic text-lg`}>deleted</Text>}
      </View>
      {open && (
        <View>
          <View className={`${isOwnMessage ? 'self-end' : 'self-start'} mt-1 mr-2`}>
            <Text className={`text-xs mt-1 ${isOwnMessage ? 'text-blue-500' : 'text-gray-500'}`}>
              {formatDate(new Date(message.created_at))}
            </Text>
          </View>

          {isOwnMessage && <TouchableOpacity
            onPress={handleDelete}
            className={`${isOwnMessage ? 'self-end' : 'self-start'} mt-1 mr-2`}
          >
            <Ionicons name='trash' size={20} color={"red"} />
          </TouchableOpacity>
          }
        </View>
      )}

    </Pressable>
  );
});

const ConversationDetails = ({ route }) => {
  const { sendMessage } = useContext(SocketContext);
  const { userId } = useContext(AuthContext);
  const { conversationId, partnerId } = route.params;
  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef(null);
  const inputRef = useRef(null);

  const {loading: loadingDeleteMessage, deleteMessage} = useDeleteMessage();
  const { conversation, loading, refetch } = useGetConversation('0', '50', conversationId);
  const {receiveMessage} = useContext(SocketContext);

  useEffect(() => {
    receiveMessage((message) => {
      if (message.conversation_id === conversationId) {
        refetch();
      }
    });
  }, []);

  const handleDeleteMessage = async (messageId) => {
    try {
      await deleteMessage(messageId, partnerId);
      await refetch();
      Toast.show({
        type: "success",
        text1: "Message deleted successfully"
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Failed to delete message",
        text2: error.message
      });
    }
  };

  const handleOpenCamera = async () => {
    // Request camera permissions
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    if (cameraStatus !== 'granted') {
      Alert.alert('Permission needed', 'Camera permission is required to take photos');
      return;
    }

    // Request media library permissions
    const { status: mediaLibraryStatus } = await MediaLibrary.requestPermissionsAsync();
    if (mediaLibraryStatus !== 'granted') {
      Alert.alert('Permission needed', 'Media library permission is required to save photos');
      return;
    }

    // Launch camera
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      
      // Save photo to media library
      try {
        const asset = await MediaLibrary.createAssetAsync(uri);
        await MediaLibrary.createAlbumAsync("YourAppName", asset, false);
        
        Toast.show({
          type: 'success',
          text1: 'Photo saved successfully'
        });
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Failed to save photo',
          text2: error.message
        });
      }
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageToSend = newMessage.trim();
    setNewMessage('');

    try {
      sendMessage(partnerId, messageToSend);
      await refetch();

      if (flatListRef.current) {
        flatListRef.current.scrollToEnd({ animated: true });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: error.message
      });
      setNewMessage(messageToSend); 
    }
  };

  const renderItem = useCallback(({ item }) => (
    <MessageBubble
      message={item}
      isOwnMessage={item.sender.id.toString() === userId}
      onDelete={handleDeleteMessage}
    />
  ), [userId, handleDeleteMessage]);

  const keyExtractor = useCallback((item) => item.message_id, []);

  if (loading && !conversation) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" className="text-blue-500" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Topbar title="Chat" showBack />

      <FlatList
        ref={flatListRef}
        data={conversation ? [...conversation].reverse() : []}
        className="flex-1 px-4 mt-2"
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
        windowSize={10}
        maxToRenderPerBatch={10}
        initialNumToRender={20}
        removeClippedSubviews={false}
      />

      <View className="p-2 border-t border-gray-200">
        <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2">
        <TouchableOpacity onPress={handleOpenCamera} className="mr-2">
            <Ionicons name="camera" size={24} color="gray" />
          </TouchableOpacity>
          <TextInput
            ref={inputRef}
            className="flex-1 mr-2 max-h-24"
            placeholder="Type a message..."
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
            maxLength={1000}
            returnKeyType="default"
          />
          <TouchableOpacity
            onPress={handleSendMessage}
            disabled={!newMessage.trim()}
            className={`rounded-full p-1 ${newMessage.trim() ? 'bg-blue-500' : 'bg-gray-300'}`}
            activeOpacity={0.7}
          >
            <Ionicons name="send" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ConversationDetails;