import { createStackNavigator } from "@react-navigation/stack";
import AssignmentList from "../screens/assignment/AssignmentList";

const Stack = createStackNavigator();

const AssignmentStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName="AssignmentList">
      <Stack.Screen name="AssignmentList" component={AssignmentList} />
    </Stack.Navigator>
  );
};

export default AssignmentStack;