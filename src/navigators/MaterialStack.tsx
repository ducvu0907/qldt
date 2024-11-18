import { createStackNavigator } from "@react-navigation/stack";
import MaterialList from "../screens/material/MaterialList";
import UploadMaterial from "../screens/material/UploadMaterial";
import MaterialInfo from "../screens/material/MaterialInfo";
import EditMaterial from "../screens/material/EditMaterial";

const Stack = createStackNavigator();

const MaterialStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName="MaterialList">
      <Stack.Screen name="MaterialList" component={MaterialList} />
      <Stack.Screen name="UploadMaterial" component={UploadMaterial} />
      <Stack.Screen name="MaterialInfo" component={MaterialInfo} />
      <Stack.Screen name="EditMaterial" component={EditMaterial} />
    </Stack.Navigator>
  );
};

export default MaterialStack;