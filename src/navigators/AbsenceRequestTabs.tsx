import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Topbar from '../components/Topbar';
import AbsenceRequestList from '../screens/absence_request/AbsenceRequestList';

const Tab = createMaterialTopTabNavigator();

const AbsenceTabs = ({ route }) => {
  // Access the route params if needed (for example, any common params passed to AbsenceTabs)
  return (
    <>
      <Topbar title="Absence Requests" showBack={true} />
      <Tab.Navigator>
        <Tab.Screen
          name="Accepted"
          children={(props) => (
            <AbsenceRequestList {...props} type="ACCEPTED" shouldRefetch={route.params?.shouldRefetch}/>
          )}
        />
        <Tab.Screen
          name="Pending"
          children={(props) => (
            <AbsenceRequestList {...props} type="PENDING" shouldRefetch={route.params?.shouldRefetch}/>
          )}
        />
        <Tab.Screen
          name="Rejected"
          children={(props) => (
            <AbsenceRequestList {...props} type="REJECTED" shouldRefetch={route.params?.shouldRefetch}/>
          )}
        />
      </Tab.Navigator>
    </>
  );
};

export default AbsenceTabs;
