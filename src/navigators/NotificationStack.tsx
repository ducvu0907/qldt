import { createStackNavigator } from "@react-navigation/stack";
import NotificationList from "../screens/notification/NotificationList";
import NotificationDetails from "../screens/notification/NotificationDetails";

const Stack = createStackNavigator();

const NotificationStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName="NotificationList">
      <Stack.Screen name="NotificationList" component={NotificationList} />
      <Stack.Screen name="NotificationDetails" component={NotificationDetails} />
    </Stack.Navigator>
  );
};

export default NotificationStack;