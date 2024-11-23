import { FlatList, Text, View, ActivityIndicator, TouchableOpacity } from "react-native";
import { useState, useCallback, useContext } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useGetMaterials } from "../../hooks/useGetMaterials";
import Topbar from "../../components/Topbar";
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialListItem from "../../components/MaterialListItem";
import { AuthContext } from "../../contexts/AuthContext";

const MaterialList = () => {
  const { role } = useContext(AuthContext);
  const { materials, loading, refetch } = useGetMaterials();
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<any>();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  // Refetch when gaining focus
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        await refetch();
      };
      fetchData();
    }, [refetch])
  );

  if (loading && !refreshing) {
    return (
      <View className="flex-1 bg-slate-50 dark:bg-slate-900">
        <Topbar title="Materials" showBack={true} />
        <View className="flex-1 justify-center items-center px-4">
          <ActivityIndicator size="large" color="#6366f1" />
          <Text className="mt-4 text-lg font-medium text-slate-600 dark:text-slate-300">
            Loading materials...
          </Text>
        </View>
      </View>
    );
  }

  const EmptyState = () => (
    <View className="flex-1 justify-center items-center px-6 py-12">
      <View className="bg-white dark:bg-slate-800 rounded-2xl p-6 items-center shadow-sm w-full">
        <Icon name="folder-open" size={48} color="#6366f1" />
        <Text className="mt-4 text-xl font-semibold text-slate-700 dark:text-slate-200">
          No Materials Yet
        </Text>
        <Text className="mt-2 text-center text-slate-500 dark:text-slate-400">
          Add your first course material by tapping the plus button below
        </Text>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-900">
      <Topbar title="Materials" showBack={true} />

      {materials?.length !== 0 ? (
        <FlatList
          data={materials}
          renderItem={({ item }) => <MaterialListItem material={item} />}
          keyExtractor={(item) => item.id.toString()}
          onRefresh={onRefresh}
          refreshing={refreshing}
          contentContainerClassName="px-4 py-2"
          className="flex-1"
          ItemSeparatorComponent={() => (
            <View className="h-2" />
          )}
        />
      ) : (
        <EmptyState />
      )}

      {role === "LECTURER" && <TouchableOpacity
        onPress={() => navigation.navigate("UploadMaterial")}
        className="absolute bottom-6 right-6 bg-indigo-500 rounded-full w-14 h-14 
                  items-center justify-center shadow-lg elevation-5
                  active:bg-indigo-600"
      >
        <Icon name="plus" size={24} color="white" />
      </TouchableOpacity>
      }

      {refreshing && (
        <View className="absolute top-0 left-0 right-0 bg-indigo-500 py-1 items-center">
          <Text className="text-white text-sm font-medium">
            Refreshing...
          </Text>
        </View>
      )}
    </View>
  );
};

export default MaterialList;