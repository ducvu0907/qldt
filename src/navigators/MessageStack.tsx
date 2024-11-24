import { createStackNavigator } from "@react-navigation/stack";
import ConversationList from "../screens/message/ConversationList";
import CreateMessage from "../screens/message/CreateMessage";

const Stack = createStackNavigator();

const MessageStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName="ConversationList">
      <Stack.Screen name="ConversationList" component={ConversationList} />
      <Stack.Screen name="CreateMessage" component={CreateMessage} />
    </Stack.Navigator>
  );
};

export default MessageStack;