import React, { useContext, useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { SocketContext } from '../../contexts/SocketContext';

const CreateMessage = () => {
  const {sendMessage} = useContext(SocketContext);
  const [receiverId, setReceiverId] = useState("");
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    try {
      if (!receiverId.trim() || !message.trim()) {
        Toast.show({
          type: "error",
          text1: "Please enter all fields"
        });
        return;
      }

      setIsLoading(true);
      sendMessage(receiverId, message);

      setMessage('');
      setReceiverId('');

    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-gray-100"
    >
      <View className="flex-1 justify-end">
        <View className="p-4 bg-white border-t border-gray-200 space-y-3">
          {/* Receiver ID Input */}
          <View className="bg-gray-100 rounded-lg px-4 py-2">
            <TextInput
              className="text-base text-gray-900"
              placeholder="Enter receiver ID..."
              value={receiverId}
              onChangeText={setReceiverId}
              editable={!isLoading}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Message Input and Send Button */}
          <View className="flex-row items-center space-x-2">
            <View className="flex-1 bg-gray-100 rounded-full px-4 py-2">
              <TextInput
                className="text-base text-gray-900"
                placeholder="Type your message..."
                value={message}
                onChangeText={setMessage}
                multiline
                maxLength={500}
                editable={!isLoading}
              />
            </View>

            <TouchableOpacity
              onPress={handleSend}
              disabled={isLoading}
              className={`w-10 h-10 rounded-full justify-center items-center ${
                isLoading ? 'bg-gray-300' : 'bg-blue-500'
              }`}
            >
              <Ionicons
                name="send"
                size={20}
                color="white"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default CreateMessage;