import { Text, TouchableOpacity, View } from "react-native";
import * as Clipboard from 'expo-clipboard';
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from '@expo/vector-icons';

export interface AssignmentItemData {
  id: number;
  title: string;
  description: string;
  lecturer_id: number;
  deadline: Date;
  file_url: string;
  class_id: string;
};

const AssignmentItem: React.FC<{ assignment: AssignmentItemData }> = ({ assignment }) => {
  const navigation = useNavigation<any>();

  const copyAssignmentFileToClipboard = async () => {
    await Clipboard.setStringAsync(assignment.file_url);
    alert("Assignment file url copied to clipboard");
  };
  
  return (
    <TouchableOpacity
      onPress={copyAssignmentFileToClipboard}
      className="w-full p-4 bg-gray-600 rounded-lg shadow-lg my-2"
    >
      <Text className="text-2xl font-extrabold text-white text-center">{assignment.title}</Text>

      <TouchableOpacity
        onPress={() => navigation.navigate("EditAssignment", { assignment })} // pass the assignment to the edit screen
        className="absolute top-4 right-4"
      >
        <MaterialIcons name="edit" size={24} color="white" />

      </TouchableOpacity>
      <View className="flex-row justify-between mt-2">
        <Text className="text-sm text-white opacity-80">
          {`Deadline: ${new Date(assignment.deadline).toLocaleDateString()}`}
        </Text>
      </View>

      <View className="mt-3 flex-row justify-between">
        <Text className="text-sm text-white opacity-70">
          {`Lecturer ID: ${assignment.lecturer_id}`}
        </Text>
        <Text className="text-sm text-white opacity-70">{`Class ID: ${assignment.class_id}`}</Text>
      </View>

      <View className="mt-3">
        <Text className="text-sm text-white opacity-90">{assignment.description}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default AssignmentItem;
