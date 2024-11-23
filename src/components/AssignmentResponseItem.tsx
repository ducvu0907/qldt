import { Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StudentAccount } from "./ClassInfo";

export interface AssignmentResponseItemData {
  id: number;
  assignment_id: number;
  submission_time: string;
  grade: number | null; 
  file_url: string;
  student_account: StudentAccount;
};

interface AssignmenrResponseProps {
  assignmentResponse: AssignmentResponseItemData
};

const AssignmentResponseItem: React.FC<AssignmenrResponseProps> = ({ assignmentResponse }) => {
  const navigation = useNavigation<any>();

  return (
    <TouchableOpacity className="w-full p-4 bg-gray-600 rounded-lg shadow-lg my-2">
      <Text className="text-2xl font-extrabold text-white text-center">
        Assignment {assignmentResponse.assignment_id}
      </Text>

      <View className="flex-row justify-between mt-2">
        <Text className="text-sm text-white opacity-80">
          Submission Time: {assignmentResponse.submission_time}
        </Text>
        <Text className="text-sm text-white opacity-80">
          Grade: {assignmentResponse.grade !== null ? assignmentResponse.grade : "Not Graded"}
        </Text>
      </View>

      <View className="mt-3">
        <Text className="text-sm text-white opacity-80">
          Student: {assignmentResponse.student_account.first_name} {assignmentResponse.student_account.last_name}
        </Text>
        <Text className="text-sm text-white opacity-80">
          Email: {assignmentResponse.student_account.email}
        </Text>
      </View>

      <View className="mt-3">
        <Text className="text-sm text-white opacity-80">
          File URL: <Text style={{ color: 'blue' }} onPress={() => navigation.navigate('FileViewer', { fileUrl: assignmentResponse.file_url })}>
            View Submission
          </Text>
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default AssignmentResponseItem;
