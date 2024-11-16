import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useContext } from "react";
import { ClassContext } from "../contexts/ClassContext";

const Tab = createMaterialTopTabNavigator();

const ClassTabs = () => {
  const { selectedClass } = useContext(ClassContext);

  return (
    <Tab.Navigator>
      <Tab.Screen />
    </Tab.Navigator>
  );
}

export default ClassTabs;
