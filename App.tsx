import "./global.css";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from "react-native";
import ApplicationNavigator from "./src/navigators/Application";
import Toast from 'react-native-toast-message';
import { AuthContextProvider } from "./src/contexts/AuthContext";

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <AuthContextProvider>
      <QueryClientProvider client={queryClient}>
        <StatusBar />
        <ApplicationNavigator />
        <Toast />
      </QueryClientProvider>
    </AuthContextProvider>
  );
}

export default App;
