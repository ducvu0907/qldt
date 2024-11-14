import { View, Text } from "react-native";

interface TopbarProps {
  title: string,
}

const Topbar: React.FC<TopbarProps> = ({ title }) => {
  return (
    <View>
      <Text>{title}</Text>
    </View>
  );
}

export default Topbar;