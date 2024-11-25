import React, { useContext } from "react";
import { Text, View, ScrollView, ActivityIndicator } from "react-native";
import { ClassContext } from "../contexts/ClassContext";
import { useGetClassInfo } from "../hooks/useGetClassInfo";
import Ionicons from "react-native-vector-icons/Ionicons";
import { AuthContext } from "../contexts/AuthContext";

export interface StudentAccount {
  account_id?: string;
  last_name?: string;
  first_name?: string;
  email?: string;
  student_id: string;
}

export interface ClassDetail {
  id: number;
  class_id: string;
  class_name: string;
  schedule?: null;
  lecturer_name?: string;
  lecturer_id?: string;
  student_count?: number;
  attached_code?: null;
  class_type: string;
  start_date: string;
  end_date: string;
  status?: string;
  student_accounts: StudentAccount[];
}

const InfoItem = ({ icon, label, value, className = "" }: { icon: string; label: string; value?: string | number; className?: string }) => (
  <View className="flex-row items-center py-3 border-b border-gray-100">
    <View className="w-8 items-center">
      <Ionicons name={icon} size={20} color="#6b7280" />
    </View>
    <View className="ml-3 flex-1">
      <Text className="text-sm text-gray-500">{label}</Text>
      <Text className={`text-base text-gray-900 mt-0.5 ${className}`}>{value || 'Not available'}</Text>
    </View>
  </View>
);

const StatusBadge = ({ status }: { status?: string }) => {
  const getStatusStyle = () => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-700';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-700';
      case 'UPCOMING':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <View className={`px-3 py-1 rounded-full ${getStatusStyle()}`}>
      <Text className="text-sm font-medium">{status}</Text>
    </View>
  );
};

const ClassInfo = () => {
  const {role} = useContext(AuthContext);
  const { selectedClassId } = useContext(ClassContext);
  const { classInfo, loading } = useGetClassInfo(selectedClassId);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="text-gray-600 mt-4">Loading class info...</Text>
      </View>
    );
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header Section */}
      <View className="bg-white p-6 border-b border-gray-200">
        <View className="flex-row justify-between items-start">
          <View className="flex-1">
            <Text className="text-2xl font-semibold text-gray-900">
              {classInfo?.class_name}
            </Text>
            <Text className="text-base text-gray-500 mt-1">
              {classInfo?.class_id}
            </Text>
          </View>
          <StatusBadge status={classInfo?.status} />
        </View>
      </View>

      {/* Class Details Section */}
      <View className="bg-white mt-4 px-6">
        
        <InfoItem 
          icon="school-outline" 
          label="Class Type" 
          value={classInfo?.class_type}
        />
        
        <InfoItem 
          icon="calendar-outline" 
          label="Schedule" 
          value={classInfo?.schedule}
        />
        
        {role === "LECTURER" && <InfoItem 
          icon="person-outline" 
          label="Lecturer" 
          value={classInfo?.lecturer_name ? `${classInfo.lecturer_name}` : 'Not assigned'}
        />
        }
        
        <InfoItem 
          icon="calendar-outline" 
          label="Start Date" 
          value={formatDate(classInfo?.start_date)}
        />
        
        <InfoItem 
          icon="calendar-outline" 
          label="End Date" 
          value={formatDate(classInfo?.end_date)}
        />
        
        {role === "LECTURER" && <InfoItem 
          icon="people-outline" 
          label="Students Enrolled" 
          value={classInfo?.student_count?.toString()}
        />
        }

      </View>

      {/* Additional Information */}
      {classInfo?.attached_code && (
        <View className="bg-white mt-4 p-6">
          <Text className="text-base font-medium text-gray-900 mb-2">Additional Information</Text>
          <InfoItem 
            icon="code-outline" 
            label="Attached Code" 
            value={classInfo.attached_code}
          />
        </View>
      )}
      
      {/* Bottom Spacing */}
      <View className="h-8" />
    </ScrollView>
  );
};

export default ClassInfo;