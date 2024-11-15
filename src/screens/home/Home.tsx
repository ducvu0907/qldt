import { View } from "react-native";
import Topbar from "../../components/Topbar";
import ClassList from "../../components/ClassList";

const Home = () => {
  return (
    <View>
      <Topbar title={"Class List"} showBack={false} showSetting={true}/>
      <ClassList />
    </View>
  );
}

export default Home;