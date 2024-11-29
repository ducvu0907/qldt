import "./global.css";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Alert, Platform, StatusBar } from "react-native";
import ApplicationNavigator from "./src/navigators/Application";
import Toast from 'react-native-toast-message';
import { AuthContextProvider } from "./src/contexts/AuthContext";
import { ClassContextProvider } from "./src/contexts/ClassContext";
import { SocketProvider } from "./src/contexts/SocketContext";
import { NewThingContextProvider } from "./src/contexts/NewThingContext";

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <AuthContextProvider>
      <NewThingContextProvider>
        <SocketProvider>
          <ClassContextProvider>
            <QueryClientProvider client={queryClient}>
              <StatusBar />
              <ApplicationNavigator />
              <Toast />
            </QueryClientProvider>
          </ClassContextProvider>
        </SocketProvider>
      </NewThingContextProvider>
    </AuthContextProvider>
  );
}

export default App;
