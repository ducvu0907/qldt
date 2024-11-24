import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AssignmentListStudent from '../screens/assignment/AssignmentListStudent';
import Topbar from '../components/Topbar';

const Tab = createMaterialTopTabNavigator();

const AssignmentTabs = () => {
  return (
    <>
      <Topbar title='Assignments' />
      <Tab.Navigator>
        <Tab.Screen name='Upcoming' component={AssignmentListStudent} initialParams={{ type: "UPCOMING" }} />
        <Tab.Screen name='Completed' component={AssignmentListStudent} initialParams={{ type: "COMPLETED" }} />
        <Tab.Screen name='Pass due' component={AssignmentListStudent} initialParams={{ type: "PASS_DUE" }} />
      </Tab.Navigator>
    </>
  );
};

export default AssignmentTabs;