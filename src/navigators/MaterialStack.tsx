import { createStackNavigator } from "@react-navigation/stack";
import MaterialList from "../screens/material/MaterialList";

const Stack = createStackNavigator();

const MaterialStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName="MaterialList">
      <Stack.Screen name="MaterialList" component={MaterialList} />
    </Stack.Navigator>
  );
};

export default MaterialStack;