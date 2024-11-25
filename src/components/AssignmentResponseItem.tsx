import { Text, TouchableOpacity, View, TextInput, Linking } from "react-native";
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useState } from "react";
import { useGetAssignmentResponses } from "../hooks/useGetAssignmentResponses";
import { StudentAccount } from "./ClassInfo";
import Toast from "react-native-toast-message";

export interface AssignmentResponseItemData {
  id: number;
  assignment_id: number;
  submission_time: string;
  grade: number | null;
  file_url: string;
  student_account: StudentAccount;
}

interface AssignmentResponseProps {
  assignmentResponse: AssignmentResponseItemData;
}

const AssignmentResponseItem: React.FC<AssignmentResponseProps> = ({
  assignmentResponse
}) => {
  const [grade, setGrade] = useState<number | string>(assignmentResponse.grade ?? "");
  const { loading, refetch } = useGetAssignmentResponses();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleGradeSubmit = async () => {
    if (!grade) {
      Toast.show({
        type: "error",
        text1: "grade input is empty"
      });
      return;
    }

    await refetch(assignmentResponse.assignment_id.toString(), {
      score: grade.toString(), 
      submission_id: assignmentResponse.id.toString()
    });
    Toast.show({
      type:"success",
      text1: "grade submission successfully"
    })
  };

  const getGradeColor = (grade: number | null) => {
    if (grade === null) return "bg-gray-700 text-gray-300";
    if (grade >= 8) return "bg-green-500/20 text-green-400";
    if (grade >= 6) return "bg-yellow-500/20 text-yellow-400";
    return "bg-red-500/20 text-red-400";
  };

  return (
    <View className="bg-gray-900 rounded-xl p-4 my-2 border border-gray-800">
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-col items-start space-x-2">
          <View className="flex-row">
          <MaterialCommunityIcons name="file-document-outline" size={20} color="#60A5FA" />
          <Text className="text-white font-medium">
            {assignmentResponse.student_account.first_name} {assignmentResponse.student_account.last_name}
          </Text>
          </View>
          <View className="flex-row">
          <MaterialCommunityIcons name="email" size={20} color="#60A5FA" />
          <Text className="text-white font-medium">
            {assignmentResponse.student_account.email}
          </Text>
          </View>
        </View>
        <View className={`px-3 py-1 rounded-full ${getGradeColor(assignmentResponse.grade)}`}>
          <Text className="text-sm font-medium text-white">
            {assignmentResponse.grade !== null ? `${assignmentResponse.grade}/10` : "Pending"}
          </Text>
        </View>
      </View>

      <Text className="text-gray-400 text-sm mb-3">
        Submitted {formatDate(assignmentResponse.submission_time)}
      </Text>

      <TouchableOpacity onPress={() => Linking.openURL(assignmentResponse.file_url)} className="flex-row justify-start">
        <Text numberOfLines={1} className="mr-3 text-blue-400 text-sm mb-4">view submission</Text>
        <MaterialCommunityIcons name="link" size={20} color="#60A5FA" />
      </TouchableOpacity>

      <View className="flex-row items-center space-x-2">
        <TextInput
          value={typeof grade === "number" ? `${grade}` : grade}
          onChangeText={text => setGrade(text)}
          keyboardType="numeric"
          placeholder="Grade (0-10)"
          placeholderTextColor="#6B7280"
          className="flex-1 bg-gray-800 rounded-lg px-3 py-2 text-white text-base"
        />
        <TouchableOpacity 
          onPress={handleGradeSubmit}
          disabled={loading}
          className={`bg-blue-600 rounded-lg p-2 ${loading ? "opacity-50" : ""}`}
        >
          {loading ? (
            <Text className="text-white font-medium">...</Text>
          ) : (
            <Ionicons name="checkmark-sharp" size={20} color="white" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AssignmentResponseItem;