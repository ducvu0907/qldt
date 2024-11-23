import { Text, TouchableOpacity, View, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

export interface AssignmentItemData {
  id: number;
  title: string;
  description: string;
  lecturer_id: number;
  deadline: Date;
  file_url: string;
  class_id: string;
}

export interface AssignmentDeleteRequest {
  token: string;
  survey_id: string;
}

interface Props {
  assignment: AssignmentItemData;
}

const AssignmentItem: React.FC<Props> = ({ assignment }) => {
  const navigation = useNavigation<any>();

  return (
    <TouchableOpacity onPress={() => navigation.navigate("AssignmentMenu", {assignment})} className="w-full p-5 bg-gray-700 rounded-xl shadow-xl my-2.5">
      <View className="space-y-3">
        <View className="flex-row justify-between items-center">
          <Text className="text-2xl font-bold text-white">
            {assignment.title}
          </Text>
        </View>

        <View className="flex-row justify-between items-center">
          <View className="bg-gray-600 px-3 py-1.5 rounded-full">
            <Text className="text-sm text-white font-medium">
              Due: {new Date(assignment.deadline).toLocaleDateString()}
            </Text>
          </View>
        </View>

        <View className="flex-row justify-between">
          <Text className="text-sm text-gray-300">
            Lecturer ID: {assignment.lecturer_id}
          </Text>
          <Text className="text-sm text-gray-300">
            Class ID: {assignment.class_id}
          </Text>
          <Text className="text-sm text-gray-300">
            Assignment ID: {assignment.id}
          </Text>
        </View>

        <View className="bg-gray-600/50 p-3 rounded-lg mt-2">
          <Text className="text-sm text-gray-100 leading-5">
            {assignment.description}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
  
};

export default AssignmentItem;