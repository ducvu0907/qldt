import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Tabs from './Tabs';

const ApplicationNavigator = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tabs />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default ApplicationNavigator;