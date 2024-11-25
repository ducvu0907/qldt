import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Linking, ScrollView, ActivityIndicator } from 'react-native';
import { RESOURCE_SERVER_URL } from '../../types';
import { AuthContext } from '../../contexts/AuthContext';
import Toast from 'react-native-toast-message';
import Topbar from '../../components/Topbar';
import { MaterialIcons } from '@expo/vector-icons';
import { StudentAccount } from '../../components/ClassInfo';

interface Submission {
  student_account: StudentAccount;
  submission_time: string;
  grade?: string;
  text_response: string;
  file_url?: string;
}

interface InfoRowProps {
  iconName: keyof typeof MaterialIcons.glyphMap;
  label: string;
  value: string;
}

const InfoRow: React.FC<InfoRowProps> = ({ iconName, label, value }) => (
  <View className="mb-6 px-4 justify-center">
    <Text className="text-gray-600 text-sm flex flex-row items-center">
      <MaterialIcons name={iconName} size={16} color="#4b5563" />
      <Text className="ml-2">{label}</Text>
    </Text>
    <Text className="text-gray-900 text-base">{value}</Text>
  </View>
);

const AssignmentStudentGrade = ({ route }) => {
  const { token } = useContext(AuthContext);
  const { assignment } = route.params;
  const [loading, setLoading] = useState<boolean>(true);
  const [submission, setSubmission] = useState<Submission | null>(null);

  useEffect(() => {
    if (!token) {
      Toast.show({
        type: 'error',
        text1: 'Authentication token missing!',
      });
      return;
    }

    const getSubmission = async () => {
      try {
        const res = await fetch(`${RESOURCE_SERVER_URL}/get_submission`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token,
            assignment_id: assignment.id,
          }),
        });

        const data = await res.json();
        if (data.meta.code !== '1000') {
          throw new Error(data.meta.message || 'Error while fetching user submission');
        }
        setSubmission(data.data);
      } catch (error: any) {
        Toast.show({
          type: 'error',
          text1: error.message,
        });
      } finally {
        setLoading(false);
      }
    };

    getSubmission();
  }, [token, assignment.id]);

  const handleOpenFile = () => {
    if (submission?.file_url) {
      Linking.openURL(submission.file_url).catch((err) => {
        console.error('Error opening file:', err);
        Toast.show({
          type: 'error',
          text1: 'Failed to open file.',
        });
      });
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#0284c7" />
        <Text className="mt-4 text-gray-600">Loading submission...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <Topbar title="Submission Details" showBack={true} />
      
      <ScrollView className="flex-1">
        <View className="bg-white rounded-lg mx-4 my-4 shadow-sm">
          <InfoRow
            iconName="person"
            label="Student Name"
            value={`${submission?.student_account.first_name} ${submission?.student_account.last_name}`}
          />

          <InfoRow
            iconName="school"
            label="Student ID"
            value={submission?.student_account.student_id || ''}
          />

          <InfoRow
            iconName="email"
            label="Email"
            value={submission?.student_account.email || ''}
          />

          <InfoRow
            iconName="access-time"
            label="Submission Time"
            value={new Date(submission?.submission_time || '').toLocaleString()}
          />

          <View className="mb-6 px-4">
            <Text className="text-gray-600 text-sm mb-1">Grade</Text>
            <View className="flex-row items-center">
              <Text className="text-2xl font-semibold text-gray-900">
                {submission?.grade || "pending"}
              </Text>
            </View>
          </View>
        </View>

        <View className="bg-white rounded-lg mx-4 mb-4 p-4 shadow-sm">
          <Text className="text-gray-600 text-sm mb-2">Text Response</Text>
          <Text className="text-gray-900 text-base leading-relaxed">
            {submission?.text_response || 'No text response provided'}
          </Text>
        </View>

        {submission?.file_url && (
          <View className="bg-white rounded-lg mx-4 mb-6 shadow-sm">
            <TouchableOpacity
              onPress={handleOpenFile}
              className="flex-row items-center p-4"
            >
              <MaterialIcons name="attach-file" size={20} color="#0284c7" />
              <Text className="ml-3 text-sky-600 font-medium">View Attached File</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default AssignmentStudentGrade;