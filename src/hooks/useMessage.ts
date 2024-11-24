import { useState, useEffect, useContext, useCallback } from 'react';
import { RESOURCE_SERVER_URL } from '../types';
import Toast from 'react-native-toast-message';
import { AuthContext } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';

// for displaying in the list of conversations
export interface ConversationItemData {
  id: string;
  Partner: {
    id: string;
    username: string;
    avatar: string;
  },
  LastMessage: {
    message: string;
    created_at: string;
    unread: string; // '1' or '0'
  }
};

export interface Message {
  message: string;
  message_id: string;
  sender: {
    id: string;
    username: string;
    avatar: string;
  },
  created_at: string; // iso
  unread: number // 1 or 0
};

const useGetListConversation = (index: string, count: string) => {
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [conversations, setConversations] = useState<any>(null);
  const [numNewMessages, setNumNewMessages] = useState<string>('0');

  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      console.log("fetching use conversations");

      const res = await fetch(`${RESOURCE_SERVER_URL}/get_list_conversation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          index,
          count
        }),
      });

      const data = await res.json();

      if (data.meta.code !== "1000") {
        throw new Error(data.meta.message || "Error while fetching conversations");
      }

      console.log(data.data);

      setConversations([...data.data.conversations]);
      setNumNewMessages(data.data.num_new_message);

    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: error.message,
      });

    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchConversations();
  }, []);

  return { conversations, loading, refetch: fetchConversations, numNewMessages };
};


const useGetConversation = (index: string, count: string, conversation_id: string) => {
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [conversation, setConversation] = useState<Message[] | null>(null);

  const fetchConversation = useCallback(async () => {
    try {
      setLoading(true);
      console.log("fetching conversation");

      const res = await fetch(`${RESOURCE_SERVER_URL}/get_conversation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          index,
          count,
          conversation_id,
          mark_as_read: "true"
        }),
      });

      const data = await res.json();

      if (data.meta.code !== "1000") {
        throw new Error(data.meta.message || "Error while fetching conversation");
      }

      console.log(data.data);
      setConversation(data.data.conversation);

    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: error.message,
      });

    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchConversation();
  }, []);

  return { conversation, loading, refetch: fetchConversation };
};

const useSendMessage = () => {
  const { sendMessage, isConnected } = useSocket();
  const [loading, setLoading] = useState<boolean>(false);

  const sendMessageToPartner = async (receiverId: string, content: string) => {
    if (!receiverId || !content) {
      Toast.show({
        type: "error",
        text1: "Message content is empty or receiver ID is missing",
      });
      return;
    }

    if (!isConnected) {
      Toast.show({
        type: "error",
        text1: "Not connected to the WebSocket server",
      });
      return;
    }

    try {
      setLoading(true);
      sendMessage(receiverId, content);
      Toast.show({
        type: "success",
        text1: "Message sent successfully",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: `Error sending message: ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    sendMessageToPartner,
    loading,
  };
};

const useDeleteMessage = (message_id: string, partner_id: string) => {
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState<boolean>(false);

  const deleteMessage = useCallback(async () => {
    try {
      setLoading(true);
      console.log("fetching use conversations");

      const res = await fetch(`${RESOURCE_SERVER_URL}/delete_message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          message_id,
          partner_id
        }),
      });

      const data = await res.json();

      if (data.meta.code !== "1000") {
        throw new Error(data.meta.message || "Error while deleting message");
      }

      Toast.show({
        type: "success",
        text1: "Delete message successfully"
      });

    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: error.message,
      });

    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    deleteMessage();
  }, []);

  return { loading, refetch: deleteMessage };
};
export {
  useGetListConversation,
  useGetConversation,
  useDeleteMessage,
  useSendMessage
};