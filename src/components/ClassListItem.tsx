import { useContext } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ClassContext } from "../contexts/ClassContext";
import { useNavigation } from "@react-navigation/native";

export interface ClassItemData {
  id: number;
  class_id: string;
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

const ClassListItem: React.FC<{ currentClass: ClassItemData }> = ({ currentClass }) => {
  const { setSelectedClassId } = useContext(ClassContext);
  const navigation = useNavigation<any>();

  const handleSelectClass = () => {
    setSelectedClassId(currentClass.class_id);
    navigation.navigate("ClassStack");
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100';
      case 'INACTIVE':
        return 'bg-gray-100';
      default:
        return 'bg-gray-100';
    }
  };

  return (
    <TouchableOpacity 
      onPress={handleSelectClass} 
      className="w-full bg-white border border-gray-200 rounded-lg my-1 hover:bg-gray-50 active:bg-gray-100"
    >
      <View className="p-3">
        {/* Header */}
        <View className="flex-row items-center">
          <View className="w-10 h-10 bg-blue-100 rounded-md items-center justify-center mr-3">
            <Text className="text-blue-700 font-semibold text-lg">
              {currentClass.class_name?.charAt(0) || currentClass.class_id.charAt(0)}
            </Text>
          </View>
          
          <View className="flex-1">
            <Text className="text-base font-semibold text-gray-900">
              {currentClass.class_name || currentClass.class_id}
            </Text>
            <Text className="text-sm text-gray-500">
              {currentClass.class_id} • {currentClass.class_type}
            </Text>
          </View>
        </View>

        {/* Details */}
        <View className="mt-2 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Text className="text-sm text-gray-500">
              {formatDate(currentClass.start_date)} - {formatDate(currentClass.end_date)}
            </Text>
            <View className="mx-2 w-1 h-1 bg-gray-300 rounded-full" />
            <Text className="text-sm text-gray-500">
              {currentClass.student_count} students
            </Text>
          </View>
          
          <View className={`px-2 py-1 rounded-full ${getStatusColor(currentClass.status)}`}>
            <Text className="text-xs font-medium text-gray-700">
              {currentClass.status}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default ClassListItem;