import { View, Text, TouchableOpacity, ActivityIndicator, Pressable, Keyboard, TextInput } from 'react-native';
import { useState, useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as DocumentPicker from 'expo-document-picker';
import { AuthContext } from '../../contexts/AuthContext';
import { RESOURCE_SERVER_URL } from '../../types';
import { ClassContext } from '../../contexts/ClassContext';
import Topbar from '../../components/Topbar';
import DateTimePicker from '@react-native-community/datetimepicker';
import { formatDate } from '../../helpers';
import { useSendNotification } from '../../hooks/useNotification';
import { useGetBasicClassInfo, useGetClassInfo } from '../../hooks/useGetClassInfo';

export interface AbsenceRequest {
  token: string;
  classId: string;
  file?: any; // optional
  date: Date; // yyyy-mm-dd
  reason: string;
  title: string; // new title field
}

const RequestAbsence = () => {
  const { token } = useContext(AuthContext);
  const { selectedClassId } = useContext(ClassContext);
  const {classInfo} = useGetBasicClassInfo(selectedClassId); // this hook has lecturer_id for the request, the details one doesn't have lecturer id for some reason
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<AbsenceRequest>({
    file: null,
    token: token || "",
    classId: selectedClassId || "",
    date: new Date(),
    reason: "",
    title: "", // initialize title
  });
  const {sendNotification} = useSendNotification();

  const navigation = useNavigation<any>();

  const handlePickingFile = async () => {
    const file = await DocumentPicker.getDocumentAsync();
    if (file.canceled) {
      return;
    }
    handleChangeInput("file", file.assets[0]);
  };

  const handleChangeInput = (field: keyof AbsenceRequest, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRequestAbsence = async () => {
    try {
      if (!formData.date || !formData.reason || !formData.title) { // check for title
        Toast.show({
          type: 'error',
          text1: 'Title, Date, and Reason are compulsory',
        });
        return;
      }

      setLoading(true);
      
      const form = new FormData();
      form.append("token", formData.token);
      form.append("classId", formData.classId);
      form.append("date", formatDate(formData.date));
      form.append("reason", formData.reason);
      form.append("title", formData.title);
      if (formData.file) {
        form.append("file", {
          uri: formData.file.uri,
          type: formData.file.mimeType,
          name: formData.file.name,
        });
      }

      const res = await fetch(`${RESOURCE_SERVER_URL}/request_absence`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: form,
      });

      const data = await res.json();

      if (data.meta.code !== "1000") {
        throw new Error(data.meta.message || 'Unknown error occurred while requesting absence');
      }

      console.log(classInfo);
      await sendNotification(token, "I send a absence request", classInfo?.lecturer_id, "ABSENCE");

      Toast.show({
        type: 'success',
        text1: 'Absence request submitted successfully',
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

  return (
    <Pressable 
      onPress={() => Keyboard.dismiss()} 
      className="flex-1 bg-slate-50 dark:bg-slate-900"
    >
      <Topbar title="Request Absence" showBack={true} />
      
      <View className="flex-1 px-6 py-8 space-y-8">
        {/* Reason for Absence */}
        <View className="space-y-2">
          <Text className="text-lg font-semibold text-slate-700 dark:text-slate-200">
            Title
          </Text>
          <TextInput
            placeholder="Title of the absence request"
            placeholderTextColor="#94a3b8"
            value={formData.title}
            onChangeText={(value) => handleChangeInput('title', value)}
            className="bg-white dark:bg-slate-800 rounded-xl p-4 text-base text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* File Picker */}
        <View className="space-y-2">
          <Text className="text-lg font-semibold text-slate-700 dark:text-slate-200">
            Absence File (Optional)
          </Text>
          <TouchableOpacity
            onPress={handlePickingFile}
            className="border-2 border-dashed border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 rounded-xl p-6"
          >
            {formData.file ? (
              <View className="items-center space-y-2">
                <Ionicons name="document-text" size={32} color="#6366f1" />
                <Text className="text-lg text-slate-700 dark:text-slate-200 text-center">
                  {formData.file.name}
                </Text>
                <Text className="text-sm text-slate-500 dark:text-slate-400">
                  Tap to change file
                </Text>
              </View>
            ) : (
              <View className="items-center space-y-2">
                <Ionicons name="cloud-upload" size={32} color="#6366f1" />
                <Text className="text-lg text-slate-700 dark:text-slate-200">
                  Select a file to upload
                </Text>
                <Text className="text-sm text-slate-500 dark:text-slate-400">
                  Tap to browse your files
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Date Picker */}
        <View className="space-y-2">
          <Text className="text-lg font-semibold text-slate-700 dark:text-slate-200">
            Date of Absence
          </Text>
          <DateTimePicker
            value={formData.date}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={(event, date) => {
              if (date) {
                setFormData((prevState) => ({
                  ...prevState,
                  date: date
                }));
              }
            }}
            themeVariant='dark'
            style={{
              marginRight: 15,
            }}
          />
        </View>

        {/* Reason for Absence */}
        <View className="space-y-2">
          <Text className="text-lg font-semibold text-slate-700 dark:text-slate-200">
            Reason for Absence
          </Text>
          <TextInput
            placeholder="Why are you absent?"
            placeholderTextColor="#94a3b8"
            value={formData.reason}
            onChangeText={(value) => handleChangeInput('reason', value)}
            className="bg-white dark:bg-slate-800 rounded-xl p-4 text-base text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Submit Button */}
        <View className="pt-4">
          <TouchableOpacity
            onPress={() => {handleRequestAbsence(); Keyboard.dismiss();}}
            disabled={loading}
            className={`bg-indigo-500 py-4 px-6 rounded-xl items-center
                      ${loading ? 'opacity-50' : 'active:bg-indigo-600'}`}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text className="text-white text-lg font-semibold">
                Submit
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Pressable>
  );
};

export default RequestAbsence;
