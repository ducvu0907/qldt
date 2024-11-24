import "./global.css";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from "react-native";
import ApplicationNavigator from "./src/navigators/Application";
import Toast from 'react-native-toast-message';
import { AuthContextProvider } from "./src/contexts/AuthContext";
import { ClassContextProvider } from "./src/contexts/ClassContext";
import { SocketProvider } from "./src/contexts/SocketContext";

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <AuthContextProvider>
      <SocketProvider>
        <ClassContextProvider>
          <QueryClientProvider client={queryClient}>
            <StatusBar />
            <ApplicationNavigator />
            <Toast />
          </QueryClientProvider>
        </ClassContextProvider>
      </SocketProvider>
    </AuthContextProvider>
  );
}

export default App;
