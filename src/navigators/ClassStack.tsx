import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

const ClassStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>

    </Stack.Navigator>
  );
}

export default ClassStack;