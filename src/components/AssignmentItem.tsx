import { Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export interface AssignmentItemData {
  id: number;
  title: string;
  description: string;
  lecturer_id: number;
  deadline: Date;
  file_url: string;
  is_submitted?: boolean;
  class_id: string;
}

interface Props {
  assignment: AssignmentItemData;
  type: string;
}

const AssignmentItem: React.FC<Props> = ({ type, assignment }) => {
  const {role} = useContext(AuthContext);
  const navigation = useNavigation<any>();
  const isOverdue = new Date(assignment.deadline) < new Date();

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleNavigation = () => {
    if (role === "STUDENT") {
      navigation.navigate(type === "COMPLETED" ? "AssignmentStudentGrade" : "SubmitAssignment", {assignment, from: "outside"});
    } else {
      navigation.navigate("AssignmentMenu", {assignment});
    }

  };

  return (
    <TouchableOpacity
      onPress={handleNavigation}
      className="bg-white rounded-lg shadow-sm border border-gray-400 overflow-hidden"
    >
      <View className="p-4 space-y-3">
        <View className="flex-row justify-between items-start">
          <Text className="text-lg font-semibold text-gray-800 flex-1 mr-2">
            {assignment.title}
          </Text>
          {assignment.file_url && (
            <Icon name="paperclip" size={16} color="#6B7280" />
          )}
        </View>

        <Text 
          className="text-gray-600 text-sm" 
          numberOfLines={2}
        >
          {assignment.description}
        </Text>

        <View className="flex-row justify-between items-center pt-2">
          <View className="flex-row items-center space-x-2">
            <Icon name="calendar" size={14} color="#6B7280" />
            <Text className={`ml-2 text-sm ${isOverdue ? 'text-red-500' : 'text-gray-600'}`}>
              Due {formatDate(assignment.deadline)}
            </Text>
          </View>
          
          <View className="flex-row items-center">
            <Text className="text-xs text-gray-500">
              Class {assignment.class_id}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default AssignmentItem;