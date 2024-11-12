import "./global.css";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from "react-native";
import ApplicationNavigator from "./src/navigators/Application";

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar />
      <ApplicationNavigator />
    </QueryClientProvider>
  );
}

export default App;
