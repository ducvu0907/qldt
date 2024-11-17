import { createStackNavigator } from "@react-navigation/stack";
import ClassMain from "../screens/class/ClassMain";
import EditClass from "../screens/class/EditClass";

const Stack = createStackNavigator();

const ClassStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName="ClassMain">
      <Stack.Screen name="ClassMain" component={ClassMain} />
      <Stack.Screen name="EditClass" component={EditClass} />
      <Stack.Screen name="AddStudent" component={ClassMain} />
      <Stack.Screen name="View Students" component={ClassMain} />
    </Stack.Navigator>
  );
};

export default ClassStack;