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

  //useFocusEffect(
  //  useCallback(() => {
  //    const fetchData = async () => {
  //      await refetch();
  //    };
  //    fetchData();
  //  }, [])
  //);

  if (loading && !refreshing) {
    return (
      <View className="flex-1 bg-slate-50 dark:bg-slate-900">
        <Topbar title="Materials" showBack={true} />
        <View className="flex-1 justify-center items-center px-4">
          <View className="bg-white dark:bg-slate-800 rounded-2xl p-8 items-center shadow-lg">
            <ActivityIndicator size="large" color="#6366f1" />
            <Text className="mt-4 text-lg font-medium text-slate-600 dark:text-slate-300">
              Loading materials...
            </Text>
          </View>
        </View>
      </View>
    );
  }

  const EmptyState = () => (
    <View className="flex-1 justify-center items-center px-6">
      <View className="bg-white dark:bg-slate-800 rounded-2xl p-8 items-center shadow-lg w-full max-w-sm">
        <Icon name="folder-open" size={48} color="#6366f1" />
        <Text className="mt-4 text-xl font-semibold text-slate-700 dark:text-slate-200">
          No Materials Yet
        </Text>
        <Text className="mt-2 text-center text-slate-500 dark:text-slate-400">
          {role === "LECTURER" 
            ? "Start by adding your first material using the button below."
            : "Check back later for new materials from your lecturer."}
        </Text>
      </View>
    </View>
  );

  const RefreshingBanner = () => (
    <View className="absolute top-0 left-0 right-0 bg-indigo-500/90 py-2 items-center backdrop-blur-sm">
      <View className="flex-row items-center space-x-2">
        <ActivityIndicator size="small" color="white" />
        <Text className="text-white text-sm font-medium">
          Refreshing...
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
          contentContainerClassName="px-4 py-4 space-y-3"
          className="flex-1"
        />
      ) : (
        <EmptyState />
      )}

      {role === "LECTURER" && (
        <TouchableOpacity
          onPress={() => navigation.navigate("UploadMaterial")}
          className="absolute bottom-6 right-6 bg-indigo-500 rounded-full w-16 h-16 
                    items-center justify-center shadow-xl elevation-5
                    active:bg-indigo-600 active:scale-95 transform transition-transform"
        >
          <Icon name="plus" size={24} color="white" />
        </TouchableOpacity>
      )}

      {refreshing && <RefreshingBanner />}
    </View>
  );
};

export default MaterialList;