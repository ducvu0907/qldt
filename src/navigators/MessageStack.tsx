import { createStackNavigator } from "@react-navigation/stack";
import ConversationList from "../screens/message/ConversationList";
import CreateMessage from "../screens/message/CreateMessage";
import ConversationDetails from "../screens/message/ConversationDetails";

const Stack = createStackNavigator();

const MessageStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName="ConversationList">
      <Stack.Screen name="ConversationList" component={ConversationList} />
      <Stack.Screen name="CreateMessage" component={CreateMessage} />
      <Stack.Screen name="ConversationDetails" component={ConversationDetails} />
    </Stack.Navigator>
  );
};

export default MessageStack;