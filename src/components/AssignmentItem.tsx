import { Text, View } from "react-native";

export interface AssignmentData {

};

const AssignmentItem: React.FC<AssignmentData> = ({ assignment }) => {
  return (
    <View>
      <Text>assignemnt item</Text>
    </View>
  );
};

export default AssignmentItem;