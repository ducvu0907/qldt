import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { RESOURCE_SERVER_URL } from "../types";
import Toast from "react-native-toast-message";
import { showToastError } from "../helpers";

interface NewThingContextType {
  numNewMessages: number;
  setNumNewMessages: (numNewMessages: number) => void;
  unreadNotifications: number;
  setUnreadNotifications: (unreadNotifications: number) => void;
};

const NewThingContext = createContext<NewThingContextType>({
  numNewMessages: 0,
  setNumNewMessages: () => {},
  unreadNotifications: 0,
  setUnreadNotifications: () => {},
});

interface NewThingContextProviderProps {
  children: ReactNode
};

const NewThingContextProvider: React.FC<NewThingContextProviderProps> = ({children}) => {
  const { token } = useContext(AuthContext);
  const [numNewMessages, setNumNewMessages] = useState<number>(0);
  const [unreadNotifications, setUnreadNotifications] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchUnreadNotificationCount = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${RESOURCE_SERVER_URL}/get_unread_notification_count`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token })
        });

        const data = await res.json();

        if (data.meta.code !== "1000") {
          throw new Error(data.meta.message || "Error while getting unread notification count");
        }

        setUnreadNotifications(data.data);

      } catch (error: any) {
        showToastError(error);

      } finally {
        setLoading(false);
      }
    };
    
    const fetchNumNewMessages = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${RESOURCE_SERVER_URL}/get_list_conversation`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token,
            index: '0',
            count: '1000'
          })
        });

        const data = await res.json();

        if (data.meta.code !== "1000") {
          throw new Error(data.meta.message || "Error while getting unread notification count");
        }

        setNumNewMessages(data.data.num_new_message);

      } catch (error: any) {
        showToastError(error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUnreadNotificationCount();
      fetchNumNewMessages();
    }

  }, [token]);

  return (
    <NewThingContext.Provider value={{numNewMessages, setNumNewMessages, unreadNotifications, setUnreadNotifications}}>
      {children}
    </NewThingContext.Provider>
  );
};

export {NewThingContext, NewThingContextProvider};