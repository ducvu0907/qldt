import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

const NotificationStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
    </Stack.Navigator>
  );
};

export default NotificationStack;