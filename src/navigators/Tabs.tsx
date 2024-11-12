import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/home/Home';

const Tab = createBottomTabNavigator();

const Tabs = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={Home} />
    </Tab.Navigator>
  )
};

export default Tabs;