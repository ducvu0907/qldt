import { createStackNavigator } from "@react-navigation/stack";
import TakeAttendance from "../screens/attendance/TakeAttendance";
import AttendanceRecord from "../screens/attendance/AttendanceRecord";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

const Stack = createStackNavigator();

const AttendanceStack = () => {
  const { role } = useContext(AuthContext);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={role === "LECTURER" ? "TakeAttendance" : "AttendanceRecord"}>
      <Stack.Screen name="TakeAttendance" component={TakeAttendance} />
      <Stack.Screen name="AttendanceRecord" component={AttendanceRecord} />
    </Stack.Navigator>
  );
};

export default AttendanceStack;