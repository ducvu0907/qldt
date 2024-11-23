import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthContext } from '../contexts/AuthContext';
import { useContext } from 'react';
import MainTabs from './MainTabs';
import AuthStack from './AuthStack';

const Stack = createStackNavigator();

const ApplicationNavigator = () => {
  const { token } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={token === null ? "Auth" : "Main"}>
        {token === null ? <Stack.Screen name='Auth' component={AuthStack} /> : <Stack.Screen name='Main' component={MainTabs} />}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default ApplicationNavigator;