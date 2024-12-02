import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Linking } from "react-native";
import { useContext, useState } from "react";
import Toast from "react-native-toast-message";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AuthContext } from "../../contexts/AuthContext";
import { RESOURCE_SERVER_URL } from "../../types";
import Topbar from "../../components/Topbar";
import { useNavigation } from "@react-navigation/native";
import { useSendNotification } from "../../hooks/useNotification";
import { StudentAccount } from "../../components/ClassInfo";
import { showToastError } from "../../helpers";

// Types remain the same...
type AbsenceStatus = 'ACCEPTED' | 'REJECTED' | 'PENDING';
type RequestData = {
  id: string;
  absence_date: string;
  title: string;
  reason: string;
  status: AbsenceStatus;
  student_account: StudentAccount
  file_url: string;
};

const InfoField = ({ label, value, textClassName = "" }: {
  label: string;
  value: string;
  textClassName?: string;
}) => (
  <View className="mb-4">
    <Text className="text-gray-500 text-sm mb-1">{label}</Text>
    <View className="bg-gray-50 rounded-lg p-3">
      <Text className={`text-gray-700 leading-6 ${textClassName}`}>{value}</Text>
    </View>
  </View>
);

const FileField = ({ url }: { url: string | null }) => {
  const handleFileOpen = async () => {
    if (url) {
      try {
        await Linking.openURL(url);
      } catch (error) {
        showToastError(error)
      }
    }
  };

  if (!url) {
    return (
      <View className="mb-4">
        <Text className="text-gray-500 text-sm mb-1">Attached File</Text>
        <View className="bg-gray-50 rounded-lg p-3 flex-row items-center">
          <MaterialCommunityIcons name="file-outline" size={20} color="#9CA3AF" />
          <Text className="text-gray-500 ml-2">No file attached</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="mb-4">
      <Text className="text-gray-500 text-sm mb-1">Attached File</Text>
      <TouchableOpacity 
        onPress={handleFileOpen}
        className="bg-gray-50 rounded-lg p-3 flex-row items-center justify-between border border-gray-200"
      >
        <View className="flex-row items-center flex-1">
          <MaterialCommunityIcons name="file-document-outline" size={20} color="#3B82F6" />
          <Text className="text-blue-600 ml-2 flex-1" numberOfLines={1}>
            View attached file
          </Text>
        </View>
        <MaterialCommunityIcons name="open-in-new" size={20} color="#3B82F6" />
      </TouchableOpacity>
    </View>
  );
};

// ActionButton component remains the same...
const ActionButton = ({ 
  onPress, 
  disabled, 
  variant = "accept" 
}: {
  onPress: () => void;
  disabled: boolean;
  variant: "accept" | "reject";
}) => {
  const bgColor = variant === "accept" ? "bg-emerald-50" : "bg-red-50";
  const textColor = variant === "accept" ? "text-emerald-600" : "text-red-600";
  const borderColor = variant === "accept" ? "border-emerald-200" : "border-red-200";
  const icon = variant === "accept" ? "check-circle-outline" : "close-circle-outline";
  const label = variant === "accept" ? "Accept" : "Reject";

  return (
    <TouchableOpacity 
      onPress={onPress}
      disabled={disabled}
      className={`flex-1 mx-2 ${bgColor} rounded-lg p-4 items-center border ${borderColor}`}
    >
      {disabled ? (
        <ActivityIndicator color={variant === "accept" ? "#059669" : "#DC2626"} />
      ) : (
        <View className="flex-row items-center">
          <MaterialCommunityIcons 
            name={icon} 
            size={20} 
            color={variant === "accept" ? "#059669" : "#DC2626"}
            style={{ marginRight: 6 }}
          />
          <Text className={`${textColor} font-medium text-base`}>{label}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

// StudentHeader component remains the same...
const StudentHeader = ({ firstName, lastName }: { firstName: string; lastName: string }) => (
  <View className="bg-gray-50 p-6 border-b border-gray-100">
    <Text className="text-xl font-semibold text-gray-800 text-center">
      {firstName} {lastName}
    </Text>
  </View>
);

const AbsenceReview = ({ route }) => {
  const { token } = useContext(AuthContext);
  const { request }: { request: RequestData } = route.params;
  console.log(request);
  const {sendNotification} = useSendNotification();
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<any>();

  // handleReview function remains the same...
  const handleReview = async (status: AbsenceStatus) => {
    setLoading(true);
    try {
      const res = await fetch(`${RESOURCE_SERVER_URL}/review_absence_request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          request_id: request.id,
          status
        }),
      });

      const data = await res.json();
      if (data.meta.code !== "1000") {
        throw new Error(data.meta.message || "Error while processing the request");
      }

      console.log(status);
      if (status === "ACCEPTED") {
        await sendNotification(token, `Your absence request has been accepted`, request.student_account.account_id, "ACCEPT_ABSENCE_REQUEST")
      } else if (status === "REJECTED") {
        await sendNotification(token, `Your absence request has been rejected`, request.student_account.account_id, "REJECT_ABSENCE_REQUEST")
      }

      Toast.show({
        type: "success",
        text1: `Request ${status.toLowerCase()}`,
        text2: `The absence request has been ${status.toLowerCase()}`
      });

      navigation.popTo("AbsenceTabs", {shouldRefetch: true});

    } catch (error: any) {
      showToastError(error)
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: AbsenceStatus) => {
    const colors = {
      PENDING: 'text-amber-600',
      ACCEPTED: 'text-emerald-600',
      REJECTED: 'text-red-600'
    };
    return colors[status] || 'text-gray-600';
  };

  const getStatusBadge = (status: AbsenceStatus) => {
    const styles = {
      PENDING: 'bg-amber-50 text-amber-600 border-amber-200',
      ACCEPTED: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      REJECTED: 'bg-red-50 text-red-600 border-red-200'
    };
    return (
      <View className={`rounded-full px-3 py-1 border ${styles[status]}`}>
        <Text className={`text-sm font-medium ${getStatusColor(status)}`}>{status}</Text>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-100">
      <Topbar title="Review Absence" showBack={true} />

      <ScrollView className="flex-1">
        <View className="bg-white rounded-lg mx-4 my-4 border border-gray-100">
          <StudentHeader 
            firstName={request.student_account.first_name}
            lastName={request.student_account.last_name}
          />

          <View className="p-5">
            <View className="mb-4">
              {getStatusBadge(request.status)}
            </View>
            
            <InfoField 
              label="Absence Date" 
              value={request.absence_date} 
            />
            <InfoField 
              label="Title" 
              value={request.title || "No title provided"} 
            />
            <InfoField 
              label="Reason" 
              value={request.reason || "No reason provided"} 
              textClassName="text-gray-600"
            />
            
            <FileField url={request.file_url} />
          </View>

          <View className="flex-row justify-between p-4 bg-gray-50 border-t border-gray-100">
            <ActionButton
              variant="reject"
              onPress={() => handleReview('REJECTED')}
              disabled={loading}
            />
            <ActionButton
              variant="accept"
              onPress={() => handleReview('ACCEPTED')}
              disabled={loading}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default AbsenceReview;