import { createStackNavigator } from "@react-navigation/stack";
import ClassMain from "../screens/class/ClassMain";
import EditClass from "../screens/class/EditClass";
import ViewStudents from "../screens/class/ViewStudents";
import AddStudent from "../screens/class/AddStudent";
import ClassDetailsInfo from "../screens/class/ClassDetailsInfo";
import UserProfile from "../screens/home/UserProfile";
import MaterialStack from "./MaterialStack";
import AssignmentStack from "./AssignmentStack";
import AttendanceStack from "./AttendanceStack";
import AbsenceRequestStack from "./AbsenceRequestStack";

const Stack = createStackNavigator();

const ClassStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName="ClassMain">
      <Stack.Screen name="ClassMain" component={ClassMain} />
      <Stack.Screen name="EditClass" component={EditClass} />
      <Stack.Screen name="AddStudent" component={AddStudent} />
      <Stack.Screen name="ViewStudents" component={ViewStudents} />
      <Stack.Screen name="ClassDetailsInfo" component={ClassDetailsInfo} />
      <Stack.Screen name="UserProfile" component={UserProfile} />
      <Stack.Screen name="MaterialStack" component={MaterialStack} />
      <Stack.Screen name="AssignmentStack" component={AssignmentStack} />
      <Stack.Screen name="AttendanceStack" component={AttendanceStack} />
      <Stack.Screen name="AbsenceRequestStack" component={AbsenceRequestStack} />
    </Stack.Navigator>
  );
};

export default ClassStack;