import { Text, View } from "react-native";

export interface ClassData {
  id?: number;
  class_id?: string;
  class_name?: string;
  schedule?: null;
  lecturer_id?: number;
  student_count?: number;
  attached_code?: null;
  class_type?: string;
  start_date?: string;
  end_date?: string;
  status?: string;
}

const Class: React.FC<{ currentClass: ClassData }> = ({ currentClass }) => {
  return (
    <View className="w-full p-4 bg-gray-600 rounded-lg shadow-lg my-2">
      <Text className="text-2xl font-extrabold text-white text-center">{currentClass.class_name} - {currentClass.class_type}</Text>

      <View className="flex-row justify-between mt-2">
        <Text className="text-sm text-white opacity-80">{`Start: ${currentClass.start_date}`}</Text>
        <Text className="text-sm text-white opacity-80">{`End: ${currentClass.end_date}`}</Text>
      </View>

      <View className="mt-3 flex-row items-center justify-between">
        <Text className="text-sm text-white opacity-70">{`Students count: ${currentClass.student_count}`}</Text>
        <Text className={`text-sm font-semibold ${currentClass.status === 'ACTIVE' ? 'text-green-400' : 'text-red-400'}`} >
          Status: {currentClass.status}
        </Text>
      </View>

      {currentClass.lecturer_id && (
        <View className="mt-4">
          <Text className="text-sm text-white opacity-80">Lecturer ID: {currentClass.lecturer_id}</Text>
        </View>
      )}
    </View>
  );
}

export default Class;
