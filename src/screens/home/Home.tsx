import { View } from "react-native";
import Topbar from "../../components/Topbar";
import Profile from "../../components/Profile";

const Home = () => {
  return (
    <View>
      <Topbar title={"Home"} showBack={false} showSetting={true}/>
      <Profile />
    </View>
  );
}

export default Home;