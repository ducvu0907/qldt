import { createStackNavigator } from "@react-navigation/stack";
import ConversationList from "../screens/message/ConversationList";

const Stack = createStackNavigator();

const MessageStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName="ConversationList">
      <Stack.Screen name="ConversationList" component={ConversationList} />
    </Stack.Navigator>
  );
};

export default MessageStack;