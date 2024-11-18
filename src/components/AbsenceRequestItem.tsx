import { Text, View } from "react-native";
import { StudentAccount } from "./ClassInfo";

export interface AbsenceRequestData {
  id: number;
  student_account: StudentAccount;
  absence_date: string; // yyyy-mm-dd
  title: string | null;
  reason: string;
  status: string; // PENDING, ACCEPTED, REJECTED
}

const AbsenceRequestItem: React.FC<{ request: AbsenceRequestData }> = ({ request }) => {

  const studentName = request.student_account.first_name && request.student_account.last_name
    ? `${request.student_account.first_name} ${request.student_account.last_name}`
    : `Student ID: ${request.student_account.student_id}`;

  return (
    <View className="w-full p-4 bg-gray-600 rounded-lg shadow-lg my-2">
      <Text className="text-2xl font-extrabold text-white text-center">{studentName}</Text>
      
      <View className="flex-row justify-between mt-2">
        <Text className="text-sm text-white opacity-80">{`Absence Date: ${request.absence_date}`}</Text>
        <Text className="text-sm text-white opacity-80">{`Title: ${request.title ?? "No title"}`}</Text>
      </View>

      <View className="mt-3">
        <Text className="text-sm text-white opacity-80">{`Reason: ${request.reason}`}</Text>
      </View>

      <View className="mt-3 flex-row items-center justify-between">
        <Text className={`text-sm font-semibold ${request.status === 'PENDING' ? 'text-yellow-400' : request.status === 'ACCEPTED' ? 'text-green-400' : 'text-red-400'}`}>
          Status: {request.status}
        </Text>
      </View>
    </View>
  );
};

export default AbsenceRequestItem;
