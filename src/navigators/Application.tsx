import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../screens/auth/Login';
import Signup from '../screens/auth/Signup';
import { AuthContext } from '../contexts/AuthContext';
import Main from '../screens/Main';
import { useContext } from 'react';

const Stack = createStackNavigator();

const ApplicationNavigator = () => {
  const { token } = useContext(AuthContext);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={token === null ? "Login" : "Main"}>
          {token === null ?
            <>
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="Signup" component={Signup} />
            </> :
            <>
              <Stack.Screen name="Main" component={Main} />
            </>
          }
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default ApplicationNavigator;