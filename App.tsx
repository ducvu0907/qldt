import "./global.css";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Alert, StatusBar } from "react-native";
import ApplicationNavigator from "./src/navigators/Application";
import Toast from 'react-native-toast-message';
import { AuthContext, AuthContextProvider } from "./src/contexts/AuthContext";
import { ClassContextProvider } from "./src/contexts/ClassContext";
import { SocketProvider } from "./src/contexts/SocketContext";
import { NewThingContextProvider } from "./src/contexts/NewThingContext";
import messaging from "@react-native-firebase/messaging";
import { useContext, useEffect, useState } from "react";

const queryClient = new QueryClient();

const App: React.FC = () => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      console.log("Authorization status: ", authStatus);
    }
    return enabled;
  };

  useEffect(() => {
    const checkPermissionAndGetToken = async () => {
      const permissionGranted = await requestUserPermission();
      if (permissionGranted) {
        const fcm = await messaging().getToken();
        setFcmToken(fcm);
        console.log("FCM token: ", fcm);
      } else {
        console.log("Permission not granted");
      }
    };

    checkPermissionAndGetToken();

    messaging().getInitialNotification().then(remoteMessage => {
      if (remoteMessage) {
        console.log('App opened from a background notification', remoteMessage.notification);
      }
    });

    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Notification caused app to open from background: ', remoteMessage.notification);
    });

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Background message handler', remoteMessage);
    });

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('Notification received in foreground:', remoteMessage);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContextProvider>
      <NewThingContextProvider>
        <SocketProvider>
          <ClassContextProvider>
            <QueryClientProvider client={queryClient}>
              <StatusBar />
              <ApplicationNavigator fcmToken={fcmToken}/>
              <Toast />
            </QueryClientProvider>
          </ClassContextProvider>
        </SocketProvider>
      </NewThingContextProvider>
    </AuthContextProvider>
  );
}

export default App;
