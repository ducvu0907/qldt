import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AssignmentListStudent from '../screens/assignment/AssignmentListStudent';
import Topbar from '../components/Topbar';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect } from 'react';

const Tab = createMaterialTopTabNavigator();

const AssignmentTabs = ({ route }) => {
  // Access the params passed to this screen
  console.log(route)

  return (
    <>
      <Topbar title="Assignments" />
      <Tab.Navigator>
        <Tab.Screen
          name="Upcoming"
          children={(props) => (
            <AssignmentListStudent {...props} type="UPCOMING" shouldRefetch={route.params?.shouldRefetch} />
          )}
        />
        <Tab.Screen
          name="Completed"
          children={(props) => (
            <AssignmentListStudent {...props} type="COMPLETED" shouldRefetch={route.params?.shouldRefetch} />
          )}
        />
        <Tab.Screen
          name="Pass Due"
          children={(props) => <AssignmentListStudent {...props} type="PASS_DUE" />}
        />
      </Tab.Navigator>
    </>
  );
};

export default AssignmentTabs;
