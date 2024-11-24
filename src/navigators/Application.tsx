import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthContext } from '../contexts/AuthContext';
import MainTabs from './MainTabs';
import AuthStack from './AuthStack';

const Stack = createStackNavigator();

const ApplicationNavigator = () => {
  const { token } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={token ? "Main" : "Auth"}
      >
        {token ? (
          <Stack.Screen
            name="Main"
            component={MainTabs}
          />
        ) : (
          <Stack.Screen name="Auth" component={AuthStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default ApplicationNavigator;
