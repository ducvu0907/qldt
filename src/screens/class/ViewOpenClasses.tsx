import React from 'react';
import { FlatList, Text, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useGetOpenClasses } from "../../hooks/useGetClasses";
import Topbar from '../../components/Topbar';

export interface OpenClassItemData {
  class_id: string;
  class_name: string;
  attached_code: string | null;
  class_type: string;
  lecturer_name: string;
  student_count: string;
  start_date: string; // yyyy-mm-dd
  end_date: string; // yyyy-mm-dd
  status: string;
}

const OpenClassItem: React.FC<{ currentClass: OpenClassItemData }> = React.memo(({ currentClass }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100';
      case 'INACTIVE':
        return 'bg-gray-100';
      default:
        return 'bg-gray-100';
    }
  };

  const handleSelectClass = () => {
    console.log(`Selected class: ${currentClass.class_id}`);
  };

  return (
    <TouchableOpacity
      onPress={handleSelectClass}
      className="w-full bg-white border border-gray-200 rounded-lg my-1 hover:bg-gray-50 active:bg-gray-100"
    >
      <View className="p-3">
      
        <View className="flex-row items-center">
          <View className="w-10 h-10 bg-blue-100 rounded-md items-center justify-center mr-3">
            <Text className="text-blue-700 font-semibold text-lg">
              {currentClass.class_name.charAt(0)}
            </Text>
          </View>
          <View className="flex-1">
            <Text className="text-base font-semibold text-gray-900">
              {currentClass.class_name}
            </Text>
            <Text className="text-sm text-gray-500">
              {currentClass.class_id} • {currentClass.class_type}
            </Text>
          </View>
        </View>


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

        <View className="mt-2">
          <Text className="text-sm text-gray-500">
            Lecturer: {currentClass.lecturer_name}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});


const ViewOpenClasses = () => {
  const { openClasses, loading, refetch } = useGetOpenClasses();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  if (loading && !refreshing) {
    return (
      <View className="flex justify-center items-center bg-gray-100 h-full">
        <ActivityIndicator size="large" color="#4B5563" />
        <Text className="mt-4 text-xl text-gray-600">Loading</Text>
      </View>
    );
  }

  const EmptyComponent = () => {
    return (
      <View className="flex justify-center items-center bg-gray-100 h-full">
        <Text className="mt-4 text-xl text-gray-600">No open classes available</Text>
      </View>
    );
  };

  return (
    <View className="w-full flex-1 bg-gray-100">
      <Topbar title='Open Classes'/>
      <FlatList
        data={openClasses}
        renderItem={({ item }) => <OpenClassItem currentClass={item} />}
        keyExtractor={(item) => item.class_id}
        onRefresh={onRefresh}
        refreshing={refreshing}
        ListEmptyComponent={EmptyComponent}
        initialNumToRender={10}
        windowSize={5}
        getItemLayout={(data, index) => ({
          length: 80,
          offset: 80 * index,
          index,
        })}
        className='p-4'
      />
    </View>
  );
};

export default ViewOpenClasses;