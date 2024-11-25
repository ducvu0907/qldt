import { createStackNavigator } from "@react-navigation/stack";
import SubmitAssignment from "../screens/assignment/SubmitAssignment";
import AssignmentTabs from "./AssignmentTabs";
import AssignmentStudentGrade from "../screens/assignment/AssignmentStudentGrade";

const Stack = createStackNavigator();

export const AssignmentStudentStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName="AssignmentTabs">
      <Stack.Screen name='AssignmentTabs' component={AssignmentTabs} />
      <Stack.Screen name="SubmitAssignment" component={SubmitAssignment} />
      <Stack.Screen name="AssignmentStudentGrade" component={AssignmentStudentGrade} />
    </Stack.Navigator>
  );
};
