import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import Topbar from "../../components/Topbar";
import { useContext, useState } from "react";
import Toast from "react-native-toast-message";
import { AuthContext } from "../../contexts/AuthContext";
import { RESOURCE_SERVER_URL } from "../../types";

const AbsenceReview = ({ route, navigation }) => {
  const { token, role } = useContext(AuthContext);
  const { request } = route.params;
  const [loading, setLoading] = useState<boolean>(false);

  const handleReview = async (status: 'ACCEPTED' | 'REJECTED' | 'PENDING') => {
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
      if (data.meta.code !== 1000) {
        throw new Error(data.meta.message || "Error while processing the request");
      }

      Toast.show({
        type: "success",
        text1: `Absence request ${status.toLowerCase()}`,
        text2: `The request has been ${status.toLowerCase()}`
      });

      navigation.goBack();

    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <Topbar title="Absence Request Review" showBack={true} />

      <ScrollView className="flex-1 px-4">
        <View className="bg-gray-100 rounded-xl shadow-md my-4 overflow-hidden">
          <View className="bg-blue-500 p-5 border-b border-blue-600">
            <Text className="text-2xl font-bold text-white text-center">
              {request.student_account.first_name} {request.student_account.last_name}
            </Text>
          </View>

          <View className="p-5 space-y-4">
            {[
              { label: "Absence Date", value: request.absence_date },
              { label: "Title", value: request.title || "No title provided" },
              { label: "Reason", value: request.reason || "No reason provided" },
              { 
                label: "Status", 
                value: request.status, 
                className: request.status === 'PENDING' ? 'text-yellow-600' : 
                           request.status === 'ACCEPTED' ? 'text-green-600' : 'text-red-600'
              }
            ].map(({ label, value, className }) => (
              <View key={label}>
                <Text className="text-gray-600 text-sm mb-1">{label}</Text>
                <View className="bg-white rounded-lg p-3 border border-gray-200">
                  <Text className={`text-gray-800 leading-5 ${className || ''}`}>{value}</Text>
                </View>
              </View>
            ))}
          </View>

          <View className="flex-row justify-between p-4 bg-gray-50">
            <TouchableOpacity 
              onPress={() => handleReview('ACCEPTED')}
              disabled={loading}
              className="flex-1 ml-2 bg-green-500 rounded-lg p-3 items-center"
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-bold text-base">Accept</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => handleReview('REJECTED')}
              disabled={loading}
              className="flex-1 mr-2 bg-red-500 rounded-lg p-3 items-center"
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-bold text-base">Reject</Text>
              )}
            </TouchableOpacity>

          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default AbsenceReview;