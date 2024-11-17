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
import ChangeInfo from '../screens/home/ChangeInfo';
import ClassTabs from './ClassTabs';
import CreateClass from '../screens/home/CreateClass';
import RegisterClass from '../screens/home/RegisterClass';
import SearchUser from '../screens/home/SearchUser';
import UserProfile from '../screens/home/UserProfile';

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
              <Stack.Screen name="CreateClass" component={CreateClass} />
              <Stack.Screen name="RegisterClass" component={RegisterClass} />
              <Stack.Screen name="ClassTabs" component={ClassTabs} />
              <Stack.Screen name="Setting" component={Setting} />
              <Stack.Screen name="ChangePassword" component={ChangePassword} />
              <Stack.Screen name="ChangeInfo" component={ChangeInfo} />
              <Stack.Screen name="SearchUser" component={SearchUser} />
              <Stack.Screen name="UserProfile" component={UserProfile} />
            </>
          }
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default ApplicationNavigator;