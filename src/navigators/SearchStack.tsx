import { createStackNavigator } from "@react-navigation/stack";
import UserProfile from "../screens/home/UserProfile";
import SearchUser from "../screens/home/SearchUser";

const Stack = createStackNavigator();

const SearchStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName="SearchUser">
      <Stack.Screen name="UserProfile" component={UserProfile} />
      <Stack.Screen name="SearchUser" component={SearchUser} />
    </Stack.Navigator>
  );
};

export default SearchStack;