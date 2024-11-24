import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, ScrollView, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../contexts/AuthContext';
import { RESOURCE_SERVER_URL } from '../../types';
import Toast from 'react-native-toast-message';
import Topbar from '../../components/Topbar';
import { useGetAssignments } from '../../hooks/useGetAssignments';

// Types
interface Assignment {
  id: string;
  title: string;
  description: string;
  deadline: Date;
  class_id: string;
  file_url?: string;
}

interface MenuButtonProps {
  onPress: () => void;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  variant: 'primary' | 'secondary' | 'danger' | 'warning';
  disabled?: boolean;
}

interface InfoItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}

// Styling constants
const BUTTON_VARIANTS = {
  primary: 'bg-blue-600',
  secondary: 'bg-green-600',
  danger: 'bg-red-600',
  warning: 'bg-yellow-600'
};

// Component: Menu Button
const MenuButton: React.FC<MenuButtonProps> = ({
  onPress,
  icon,
  label,
  variant,
  disabled = false
}) => (
  <TouchableOpacity
    className={`
      flex justify-center items-center
      w-full h-16 rounded-xl mb-4
      ${BUTTON_VARIANTS[variant]}
      ${disabled ? 'opacity-60' : ''}
      active:opacity-80
    `}
    onPress={onPress}
    disabled={disabled}
  >
    <Ionicons name={icon} size={24} color="white" />
    <Text className="mt-2 text-white text-base font-semibold">{label}</Text>
  </TouchableOpacity>
);

// Component: Info Item
const InfoItem: React.FC<InfoItemProps> = ({ icon, label, value }) => (
  <View className="flex-row items-center mb-6 p-3 bg-gray-50 rounded-lg">
    <View className="w-10 h-10 rounded-full bg-gray-200 items-center justify-center">
      <Ionicons name={icon} size={20} color="#4B5563" />
    </View>
    <View className="flex-1 ml-4">
      <Text className="text-sm text-gray-500 mb-1">{label}</Text>
      <Text className="font-medium text-gray-800">{value}</Text>
    </View>
  </View>
);

// Component: Assignment Header
const AssignmentHeader: React.FC<{ title: string; description: string }> = ({
  title,
  description
}) => (
  <View className="mb-6 border-b border-gray-200 pb-6">
    <Text className="text-2xl font-bold text-gray-800">{title}</Text>
    <Text className="text-sm text-gray-600 mt-2 leading-relaxed">{description}</Text>
  </View>
);

// Component: File Attachment
const FileAttachment: React.FC<{ fileUrl: string }> = ({ fileUrl }) => (
  <TouchableOpacity
    onPress={() => Linking.openURL(fileUrl)}  // Opening the URL in a browser or external app
    className="flex-row items-center mb-6 p-4 bg-gray-100 rounded-xl active:bg-gray-200"
  >
    <View className="flex-row items-center flex-1">
      <Ionicons name="document" size={24} color="#4B5563" />
      <Text className="ml-3 text-gray-800 font-medium">Open Attached File</Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color="#4B5563" />
  </TouchableOpacity>
);

// Component: Action Buttons
const ActionButtons: React.FC<{
  role: string;
  loading: boolean;
  onSubmit: () => void;
  onViewResponses: () => void;
  onDelete: () => void;
  onEdit: () => void;
}> = ({ role, loading, onSubmit, onViewResponses, onDelete, onEdit }) => {
  if (loading) {
    return <ActivityIndicator size="large" color="#4B5563" />;
  }

  return role === "STUDENT" ? (
    <MenuButton
      onPress={onSubmit}
      icon="send"
      label="Submit Response"
      variant="secondary"
    />
  ) : (
    <>
      <MenuButton
        onPress={onViewResponses}
        icon="document-text"
        label="View Responses"
        variant="primary"
      />
      <MenuButton
        onPress={onEdit}
        icon="pencil"
        label="Edit Assignment"
        variant="warning"
      />
      <MenuButton
        onPress={onDelete}
        icon="trash"
        label="Delete Assignment"
        variant="danger"
      />
    </>
  );
};

// Utility functions
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

// Main Component
const AssignmentMenu = ({ route }) => {
  const { token, role } = useContext(AuthContext);
  const { assignment } = route.params;
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState<boolean>(false);

  const handleDeleteAssignment = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${RESOURCE_SERVER_URL}/delete_survey`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, survey_id: assignment.id })
      });

      const data = await res.json();

      if (data.meta.code !== "1000") {
        throw new Error(data.meta.message || "Error while deleting assignment");
      }

      Toast.show({ type: "success", text1: "Assignment deleted successfully" });
      navigation.goBack();

    } catch (error: any) {
      Toast.show({ type: 'error', text1: error.message });
    } finally {
      setLoading(false);
    }
  };

  const showDeleteConfirmation = () => {
    Alert.alert(
      "Delete Assignment",
      `Are you sure you want to delete "${assignment.title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: handleDeleteAssignment }
      ],
      { cancelable: true }
    );
  };

  return (
    <View className="flex-1 bg-white">
      <Topbar title="Assignment Details" showBack={true} />

      <ScrollView className="flex-1 px-6 py-4">
        <AssignmentHeader
          title={assignment.title}
          description={assignment.description}
        />

        <View className="mb-6">
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
            <FileAttachment fileUrl={assignment.file_url} />
          )}
        </View>

        <View className="items-center py-4">
          <ActionButtons
            role={role}
            loading={loading}
            onSubmit={() => navigation.navigate("SubmitAssignment", { assignment })}
            onViewResponses={() => navigation.navigate("ViewResponses", { assignment })}
            onDelete={showDeleteConfirmation}
            onEdit={() => navigation.navigate("EditAssignment", { assignment })}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default AssignmentMenu;
