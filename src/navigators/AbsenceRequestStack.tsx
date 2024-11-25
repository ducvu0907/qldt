import { createStackNavigator } from "@react-navigation/stack";
import RequestAbsence from "../screens/absence_request/RequestAbsence";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import AbsenceReview from "../screens/absence_request/AbsenceReview";
import AbsenceRequestList from "../screens/absence_request/AbsenceRequestList";
import AbsenceTabs from "./AbsenceRequestTabs";

const Stack = createStackNavigator();

const AbsenceRequestStack = () => {
  const {role} = useContext(AuthContext);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={role === "LECTURER" ? "AbsenceTabs" : "RequestAbsence"} >
      <Stack.Screen name="RequestAbsence" component={RequestAbsence} />
      <Stack.Screen name="AbsenceReview" component={AbsenceReview} />
      <Stack.Screen name="AbsenceRequestList" component={AbsenceRequestList} />
      <Stack.Screen name="AbsenceTabs" component={AbsenceTabs} />
    </Stack.Navigator>
  );
};

export default AbsenceRequestStack;