import { useState, useEffect, useContext, useCallback } from 'react';
import { RESOURCE_SERVER_URL } from '../types';
import Toast from 'react-native-toast-message';
import { AuthContext } from '../contexts/AuthContext';

const useGetListConversation = (index: string, count: string) => {
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [conversations, setConversations] = useState<any>(null);

  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      console.log("fetching use conversations");

      let res = await fetch(`${RESOURCE_SERVER_URL}/get_list_conversation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          index: '0',
          count: count
        }),
      });

      const data = await res.json();

      if (data.meta.code !== "1000") {
        throw new Error(data.meta.message || "Error while fetching conversations");
      }

      console.log(data.data);

      setConversations([...data.data.conversations]);

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

  return { conversations, loading, refetch: fetchConversations };
};


const useGetConversation = (index: string, count: string, conversation_id: string) => {
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [conversation, setConversation] = useState<any>(null);

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
          index: 0,
          count: count,
          conversation_id,
          mark_as_read: true
        }),
      });

      const data = await res.json();

      if (data.meta.code !== "1000") {
        throw new Error(data.meta.message || "Error while fetching conversation");
      }

      console.log(data.data);

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
  useDeleteMessage
};