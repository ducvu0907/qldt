import { View, Text, ScrollView, Linking, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import Topbar from "../../components/Topbar";
import { MaterialIcons } from '@expo/vector-icons';
import { useContext, useState } from "react";
import Toast from "react-native-toast-message";
import { AuthContext } from "../../contexts/AuthContext";
import { RESOURCE_SERVER_URL } from "../../types";
import { useGetMaterials } from "../../hooks/useGetMaterials";

const MaterialInfo = ({ route, navigation }) => {
  const { token, role } = useContext(AuthContext);
  const { material } = route.params;
  const [loading, setLoading] = useState<boolean>(false);

  const handleOpenLink = async () => {
    if (material.material_link) {
      const canOpen = await Linking.canOpenURL(material.material_link);
      if (canOpen) {
        await Linking.openURL(material.material_link);
      }
    }
  };

  const handleEdit = () => {
    navigation.navigate('EditMaterial', { material });
  };

  const handleDeleteMaterial = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${RESOURCE_SERVER_URL}/delete_material`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          material_id: material.id
        }),
      });

      const data = await res.json();
      if (data.code !== "1000") {
        throw new Error(data.message || "Error while deleting material");
      }

      Toast.show({
        type: "success",
        text1: "Material deleted successfully"
      });

      navigation.goBack();

    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Material",
      "Are you sure you want to delete this material?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: handleDeleteMaterial }
      ]
    );
  };

  const InfoField = ({ label, value, icon = null, onPress = null }) => (
    <View className="space-y-1.5">
      <Text className="text-sm font-medium text-slate-400 dark:text-slate-500">
        {label}
      </Text>
      <TouchableOpacity
        disabled={!onPress}
        onPress={onPress}
        className="bg-white/5 dark:bg-slate-800/50 rounded-lg p-3 flex-row items-center"
      >
        {icon && <View className="mr-3">{icon}</View>}
        <Text 
          className={`flex-1 ${onPress ? 'text-indigo-400' : 'text-slate-500 dark:text-slate-300'}`}
          numberOfLines={value === material.material_link ? 1 : undefined}
        >
          {value || `No ${label.toLowerCase()} available`}
        </Text>
        {onPress && <MaterialIcons name="open-in-new" size={18} color="#818cf8" />}
      </TouchableOpacity>
    </View>
  );

  const getTypeIcon = (type: string) => {
    const iconMap = {
      pdf: { name: 'picture-as-pdf', color: '#ef4444' },
      doc: { name: 'article', color: '#3b82f6' },
      ppt: { name: 'slideshow', color: '#f97316' },
      xls: { name: 'table-chart', color: '#22c55e' }
    };

    const fileType = type?.toLowerCase() || 'unknown';
    const iconInfo = iconMap[fileType] || { name: 'insert-drive-file', color: '#6366f1' };

    return <MaterialIcons name={iconInfo.name} size={20} color={iconInfo.color} />;
  };

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-900">
      <Topbar title="Material Details" showBack={true} />

      <ScrollView 
        className="flex-1 px-4"
        contentContainerClassName="pb-6"
      >
        <View className="bg-white dark:bg-slate-800 rounded-xl shadow-sm my-4 overflow-hidden">
          <View className="p-4 border-b border-slate-100 dark:border-slate-700">
            <View className="flex-row items-center justify-center space-x-2">
              {getTypeIcon(material.material_type)}
              <Text className="text-xl font-semibold text-slate-900 dark:text-white text-center">
                {material.material_name}
              </Text>
            </View>
          </View>

          <View className="p-4 space-y-4">
            <View className="flex-row space-x-4">
              <View className="flex-1">
                <InfoField
                  label="Type"
                  value={material.material_type}
                  icon={getTypeIcon(material.material_type)}
                />
              </View>
              <View className="flex-1">
                <InfoField
                  label="Class ID"
                  value={material.class_id}
                  icon={<MaterialIcons name="class" size={20} color="#6366f1" />}
                />
              </View>
            </View>

            <InfoField
              label="Description"
              value={material.description}
              icon={<MaterialIcons name="description" size={20} color="#6366f1" />}
            />

            <InfoField
              label="Material Link"
              value={"View attached file"}
              icon={<MaterialIcons name="link" size={20} color="#6366f1" />}
              onPress={material.material_link ? handleOpenLink : undefined}
            />
          </View>
        </View>

        {role === "LECTURER" && (
          <View className="space-y-3 px-1">
            <TouchableOpacity
              onPress={handleEdit}
              className="bg-indigo-500/90 rounded-lg p-3.5 flex-row items-center justify-center
                        active:bg-indigo-600/90 backdrop-blur-sm"
            >
              <MaterialIcons name="edit" size={20} color="white" className="mr-2" />
              <Text className="text-white font-medium text-base ml-2">
                Edit Material
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleDelete}
              disabled={loading}
              className="mt-2 bg-red-500/90 rounded-lg p-3.5 flex-row items-center justify-center
                        active:bg-red-600/90 backdrop-blur-sm"
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <MaterialIcons name="delete-outline" size={20} color="white" className="mr-2" />
                  <Text className="text-white font-medium text-base ml-2">
                    Delete Material
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default MaterialInfo;