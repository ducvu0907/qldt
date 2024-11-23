import { createStackNavigator } from "@react-navigation/stack";
import Home from "../screens/home/Home";
import CreateClass from "../screens/home/CreateClass";
import RegisterClass from "../screens/home/RegisterClass";
import ClassStack from "./ClassStack";

const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName="Home">
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="CreateClass" component={CreateClass} />
      <Stack.Screen name="RegisterClass" component={RegisterClass} />
      <Stack.Screen name="ClassStack" component={ClassStack} />
    </Stack.Navigator>
  );
};

export default HomeStack;