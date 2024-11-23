import { createStackNavigator } from "@react-navigation/stack";
import Setting from "../screens/home/Setting";
import ChangePassword from "../screens/home/ChangePassword";
import ChangeInfo from "../screens/home/ChangeInfo";

const Stack = createStackNavigator();

const SettingStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName="Setting">
      <Stack.Screen name="Setting" component={Setting} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
      <Stack.Screen name="ChangeInfo" component={ChangeInfo} />
    </Stack.Navigator>
  );
};

export default SettingStack;