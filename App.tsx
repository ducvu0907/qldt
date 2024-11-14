import "./global.css";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from "react-native";
import ApplicationNavigator from "./src/navigators/Application";
import Toast from 'react-native-toast-message';

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar />
      <ApplicationNavigator />
      <Toast />
    </QueryClientProvider>
  );
}

export default App;
