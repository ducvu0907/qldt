import { createStackNavigator } from "@react-navigation/stack";
import AssignmentList from "../screens/assignment/AssignmentList";
import CreateAssignment from "../screens/assignment/CreateAssignment";
import EditAssignment from "../screens/assignment/EditAssignment";
import AssignmentMenu from "../screens/assignment/AssignmentMenu";
import ViewResponses from "../screens/assignment/ViewResponses";

const Stack = createStackNavigator();

const AssignmentStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName="AssignmentList">
      <Stack.Screen name="AssignmentList" component={AssignmentList} />
      <Stack.Screen name="CreateAssignment" component={CreateAssignment} />
      <Stack.Screen name="EditAssignment" component={EditAssignment} />
      <Stack.Screen name="AssignmentMenu" component={AssignmentMenu} />
      <Stack.Screen name="ViewResponses" component={ViewResponses} />
    </Stack.Navigator>
  );
};

export default AssignmentStack;