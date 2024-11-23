import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../contexts/AuthContext';
import { RESOURCE_SERVER_URL } from '../../types';
import Toast from 'react-native-toast-message';
import Topbar from '../../components/Topbar';

const MenuButton = ({
  onPress,
  icon,
  label,
  bgColor,
  disabled = false
}: {
  onPress: () => void;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  bgColor: string;
  disabled?: boolean;
}) => (
  <TouchableOpacity
    className={`flex justify-center items-center w-64 h-32 rounded-xl mb-4 ${bgColor} ${disabled ? 'opacity-50' : ''}`}
    onPress={onPress}
    disabled={disabled}
  >
    <Ionicons name={icon} size={32} color="white" />
    <Text className="mt-2 text-white text-lg font-medium text-center">
      {label}
    </Text>
  </TouchableOpacity>
);

const InfoItem = ({
  icon,
  label,
  value
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) => (
  <View className="flex-row items-center mb-4">
    <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mr-3">
      <Ionicons name={icon} size={20} color="#4B5563" />
    </View>
    <View className="flex-1">
      <Text className="text-gray-500 text-sm">{label}</Text>
      <Text className="text-gray-800 font-medium">{value}</Text>
    </View>
  </View>
);

const AssignmentMenu = ({ route }) => {
  const { token, role } = useContext(AuthContext);
  const { assignment } = route.params;
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState<boolean>(false);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const showDeleteConfirmation = () => {
    Alert.alert(
      "Delete Assignment",
      `Are you sure you want to delete "${assignment.title}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: handleDeleteAssignment
        }
      ],
      { cancelable: true }
    );
  };

  const handleDeleteAssignment = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${RESOURCE_SERVER_URL}/delete_survey`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          survey_id: assignment.id
        }),
      });

      const data = await res.json();

      console.log(data);
      if (data.meta.code !== "1000") {
        throw new Error(data.meta.message || "Error while deleting assignment");
      }

      Toast.show({
        type: "success",
        text1: "Assignment deleted successfully"
      });

      navigation.goBack();

    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewFile = () => {
    if (assignment.file_url) {
      navigation.navigate('FileViewer', { fileUrl: assignment.file_url });
    }
  };

  return (
    <View className="flex-1 bg-white">
      <Topbar title='Assignment Details' showBack={true} />

      <ScrollView className="flex-1 px-4">
        {/* Assignment Header */}
        <View className="py-6 border-b border-gray-200">
          <Text className="text-2xl font-bold text-gray-800 mb-2">
            {assignment.title}
          </Text>
          <Text className="text-gray-600">
            {assignment.description}
          </Text>
        </View>

        {/* Assignment Info */}
        <View className="py-6">
          <InfoItem
            icon="time"
            label="Deadline"
            value={formatDate(assignment.deadline)}
          />

          <InfoItem
            icon="folder"
            label="Class ID"
            value={assignment.class_id}
          />

          {assignment.file_url && (
            <TouchableOpacity
              onPress={handleViewFile}
              className="flex-row items-center mb-4 p-4 bg-gray-50 rounded-lg"
            >
              <Ionicons name="document" size={24} color="#4B5563" />
              <Text className="ml-3 text-gray-800 font-medium">
                View Attached File
              </Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color="#4B5563"
                style={{ marginLeft: 'auto' }}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Action Buttons */}
        <View className="items-center py-6">
          {loading ? (
            <ActivityIndicator size="large" color="#4B5563" />
          ) : (
            <>
              {role === "STUDENT" ? (
                <MenuButton
                  onPress={() => navigation.navigate("SubmitAssignment", { assignment })}
                  icon="send"
                  label="Submit Response"
                  bgColor="bg-green-600"
                />
              ) : (
                <>
                  <MenuButton
                    onPress={() => navigation.navigate("ViewResponses", { assignment })}
                    icon="document-text"
                    label="View Responses"
                    bgColor="bg-blue-600"
                  />

                  <MenuButton
                    onPress={showDeleteConfirmation}
                    icon="trash"
                    label="Delete Assignment"
                    bgColor="bg-red-600"
                  />

                  <MenuButton
                    onPress={() => navigation.navigate("EditAssignment", { assignment })}
                    icon="pencil"
                    label="Edit Assignment"
                    bgColor="bg-yellow-600"
                  />
                </>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default AssignmentMenu;