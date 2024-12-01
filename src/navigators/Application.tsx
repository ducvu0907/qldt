import React, { useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthContext } from '../contexts/AuthContext';
import MainTabs from './MainTabs';
import AuthStack from './AuthStack';

const Stack = createStackNavigator();

const ApplicationNavigator = ({ fcmToken }: { fcmToken: string | null }) => {
  const { setFcmToken } = useContext(AuthContext);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    setFcmToken(fcmToken);
  }, [fcmToken]);

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
