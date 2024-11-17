import { View } from "react-native";
import Topbar from "../../components/Topbar";
import ClassInfo from "../../components/ClassInfo";

const ClassDetailsInfo = () => {
  return (
    <View className="flex-1">
    <Topbar title="Class Info" showBack={true}/>
    <ClassInfo />
    </View>
  );
};

export default ClassDetailsInfo;