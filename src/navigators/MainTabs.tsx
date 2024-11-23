import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SearchStack from "./SearchStack";
import SettingStack from "./SettingStack";
import HomeStack from "./HomeStack";

const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Home"
        component={HomeStack}
      />
      <Tab.Screen
        name="Search"
        component={SearchStack}
      />

      <Tab.Screen
        name="Setting"
        component={SettingStack}
      />

    </Tab.Navigator>
  );
};

export default MainTabs;