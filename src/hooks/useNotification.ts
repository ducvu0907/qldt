import { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { RESOURCE_SERVER_URL } from "../types";
import Toast from "react-native-toast-message";
import { useMediaLibraryPermissions } from "expo-image-picker";

export interface SendNotificationRequest {
  token: string;
  message: string;
  toUser: string;
  image?: any; // image file
  type: string; // ABSENCE, ACCEPT_ABSENCE_REQUEST, REJECT_ABSENCE_REQUEST, ASSIGNMENT_GRADE
};

export interface NotificationItemData {
  id: number;
  message: string;
  status: string; // UNREAD, READ
  from_user: number; // from user id
  to_user: number; // to user id
  type: string; // ABSENCE, ACCEPT_ABSENCE_REQUEST, REJECT_ABSENCE_REQUEST, ASSIGNMENT_GRADE
  sent_time: string; // iso time
  data: any;
  title_push_notification: string;
};

const useSendNotification = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const sendNotification = useCallback(async (token: string, message: string, toUser: string, type: string, image?: any) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("token", token);
      formData.append("message", message);
      formData.append("toUser", toUser);
      formData.append("type", type);
      if (image) {
        formData.append("image", image);
      }
      
      console.log(formData);
      const res = await fetch(`${RESOURCE_SERVER_URL}/send_notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: formData
      });

      const data = await res.json();

      if (data.meta.code !== "1000") {
        throw new Error(data.meta.message || "Error while sending notification");
      }

      console.log(data.data);

      Toast.show({
        type: "success",
        text1: "send notification successfully"
      });

    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: error.message,
      });

    } finally {
      setLoading(false);
    }

  }, []);

  return { loading, sendNotification };
};

const useGetNotifications = (index: string, count: string) => {
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<any>(null);

  const getNotifications = useCallback(async () => {
    try {
      setLoading(true);
      console.log("fetching user notifications");

      const res = await fetch(`${RESOURCE_SERVER_URL}/get_notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          index,
          count
        })
      });

      const data = await res.json();

      if (data.meta.code !== "1000") {
        throw new Error(data.meta.message || "Error while getting user notifications");
      }

      console.log(data.data);
      setNotifications([...data.data]);

    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: error.message,
      });

    } finally {
      setLoading(false);
    }

  }, []);

  useEffect(() => {
    getNotifications();
  }, []);

  return {  notifications, loading, getNotifications };
};

const useGetUnreadNotificationCount = () => {
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [unreads, setUnReads] = useState<number>(0);

  const getUnreadNotificationCount = useCallback(async () => {
    try {
      setLoading(true);
      console.log("fetching user unread conversations");

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

      setUnReads(data.data);

    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: error.message,
      });

    } finally {
      setLoading(false);
    }

  }, []);

  useEffect(() => {
    getUnreadNotificationCount();
  }, []);

  return {  loading, unreads, getUnreadNotificationCount };
};

const useMarkNotificationAsRead = () => {
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState<boolean>(false);

  const markNotificationAsRead = useCallback(async (notification_id: string) => {
    try {
      console.log("marking user notifications as read");
      setLoading(true);

      const res = await fetch(`${RESOURCE_SERVER_URL}/mark_notification_as_read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          notification_id
        })
      });

      const data = await res.json();

      console.log(data);
      if (data.meta.code !== "1000") {
        throw new Error(data.meta.message || "Error while marking notification as read");
      }

    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: error.message,
      });

    } finally {
      setLoading(false);
    }

  }, []);

  return { loading, markNotificationAsRead };
};
export {
  useSendNotification,
  useGetNotifications,
  useGetUnreadNotificationCount,
  useMarkNotificationAsRead
};