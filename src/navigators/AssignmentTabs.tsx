import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AssignmentListStudent from '../screens/assignment/AssignmentListStudent';
import Topbar from '../components/Topbar';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useContext, useEffect } from 'react';
import { ClassContext } from '../contexts/ClassContext';

const Tab = createMaterialTopTabNavigator();

const AssignmentTabs = ({ route }) => {
  // Access the params passed to this screen
  console.log(route)

  return (
    <>
      <Topbar title="Assignments" showBack={route.params?.class_id}/>
      <Tab.Navigator>
        <Tab.Screen
          name="Upcoming"
          children={(props) => (
            <AssignmentListStudent {...props} type="UPCOMING" shouldRefetch={route.params?.shouldRefetch} class_id={route.params?.class_id}/>
          )}
        />
        <Tab.Screen
          name="Completed"
          children={(props) => (
            <AssignmentListStudent {...props} type="COMPLETED" shouldRefetch={route.params?.shouldRefetch} class_id={route.params?.class_id}/>
          )}
        />
        <Tab.Screen
          name="Pass Due"
          children={(props) => <AssignmentListStudent {...props} type="PASS_DUE" shouldRefetch={null} class_id={route.params?.class_id}/>}
        />
      </Tab.Navigator>
    </>
  );
};

export default AssignmentTabs;
