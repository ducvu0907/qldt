import { createStackNavigator } from "@react-navigation/stack";
import NotificationList from "../screens/notification/NotificationList";

const Stack = createStackNavigator();

const NotificationStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName="NotificationList">
      <Stack.Screen name="NotificationList" component={NotificationList} />
    </Stack.Navigator>
  );
};

export default NotificationStack;