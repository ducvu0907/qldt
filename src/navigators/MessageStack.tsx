import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

const MessageStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
    </Stack.Navigator>
  );
};

export default MessageStack;