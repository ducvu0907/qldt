import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ClassStack from './ClassStack';

const Tab = createBottomTabNavigator();

const ClassTabs = () => {
  return (
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="ClassStack" component={ClassStack} />
      </Tab.Navigator>
  );
}

export default ClassTabs;
