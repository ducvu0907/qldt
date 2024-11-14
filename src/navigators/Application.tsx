import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../screens/auth/Login';
import Signup from '../screens/auth/Signup';
import { AuthContext } from '../contexts/AuthContext';
import { useContext } from 'react';
import Home from '../screens/home/Home';
import Setting from '../screens/home/Setting';
import ChangePassword from '../screens/home/ChangePassword';

const Stack = createStackNavigator();

const ApplicationNavigator = () => {
  const { token } = useContext(AuthContext);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={token === null ? "Login" : "Home"}>
          {token === null ?
            <>
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="Signup" component={Signup} />
            </> :
            <>
              <Stack.Screen name="Home" component={Home} />
              <Stack.Screen name="Setting" component={Setting} />
              <Stack.Screen name="ChangePassword" component={ChangePassword} />
            </>
          }
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default ApplicationNavigator;