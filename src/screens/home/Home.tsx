import { View, Text } from "react-native";
import Topbar from "../../components/Topbar";
import Profile from "../../components/Profile";
import { useGetUser } from "../../hooks/useGetUser";

export interface User {
  id?: number,
  email?: string,
  ho?: string,
  ten?: string,
  name?: string,
  token?: string,
  role?: string,
  status?: string,
  avatar?: string | null
}

const Home = () => {
  return (
    <View>
      <Topbar title={"Home"} showBack={false}/>
      <Profile />
    </View>
  );
}

export default Home;