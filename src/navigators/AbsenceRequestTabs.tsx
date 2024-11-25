import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Topbar from '../components/Topbar';
import AbsenceRequestList from '../screens/absence_request/AbsenceRequestList';

const Tab = createMaterialTopTabNavigator();

const AbsenceTabs = () => {
  return (
    <>
      <Topbar title='Absence Requests' showBack={true}/>
      <Tab.Navigator>
        <Tab.Screen name='Accepted' component={AbsenceRequestList} initialParams={{ type: "ACCEPTED" }} />
        <Tab.Screen name='Pending' component={AbsenceRequestList} initialParams={{ type: "PENDING" }} />
        <Tab.Screen name='Rejected' component={AbsenceRequestList} initialParams={{ type: "REJECTED" }} />
      </Tab.Navigator>
    </>
  );
};

export default AbsenceTabs;