import { View, Text, TextInput, TouchableOpacity, Pressable, Keyboard, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import Logo from "../../components/Logo";
import { useContext, useEffect, useState } from 'react';
import DropDownPicker from "react-native-dropdown-picker";
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { RESOURCE_SERVER_URL } from '../../types';
import Ionicons from "react-native-vector-icons/Ionicons";
import { AuthContext } from '../../contexts/AuthContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import { formatDate } from '../../helpers';
import { ClassContext } from '../../contexts/ClassContext';
import { useGetClassInfo } from '../../hooks/useGetClassInfo';
import Topbar from '../../components/Topbar';

export interface EditClassRequest {
  token: string;
  class_id: string;
  class_name?: string | null;
  status?: string | null;
  start_date?: Date | null;
  end_date?: Date | null;
};

const EditClass = () => {
  const { token } = useContext(AuthContext);
  const { selectedClassId } = useContext(ClassContext);
  const {classInfo, loading: classInfoLoading} = useGetClassInfo(selectedClassId);
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<EditClassRequest>({
    token: token || "",
    class_id: selectedClassId || "",
    class_name: classInfo?.class_name,
    status: classInfo?.status,
    start_date: new Date(classInfo?.start_date || ""),
    end_date: new Date(classInfo?.end_date || ""),
  });

  const navigation = useNavigation<any>();

  useEffect(() => {
    if (classInfo) {
      setFormData({
        token: token || "",
        class_id: selectedClassId || "",
        class_name: classInfo?.class_name || '',
        status: classInfo?.status || '',
        start_date: new Date(classInfo?.start_date || Date.now()),
        end_date: new Date(classInfo?.end_date || Date.now()),
      });
    }
  }, [classInfo, selectedClassId, token]);

  const handleChangeInput = (field: keyof EditClassRequest, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDeleteClass = async () => {
    try {
      setLoading(true);

      console.log("deleting class");

      let res = await fetch(`${RESOURCE_SERVER_URL}/delete_class`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          class_id: selectedClassId
        }),
      });

      const data = await res.json();

      if (data.meta.code !== "1000") {
        throw new Error(data.meta.message || "Error while deleting class");
      }

      Toast.show({
        type: "success",
        text1: "Delete class successfully"
      });

      navigation.popTo("Home");

    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const showDeleteConfirmation = () => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this class?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: handleDeleteClass,
          style: "destructive"
        }
      ]
    );
  };

  const handleEditClass = async () => {
    try {
      setLoading(true);

      const requestData: any = {
        token: formData.token,
        class_id: formData.class_id,
        class_name: formData.class_name || null,
        status: formData.status || null,
        start_date: formData.start_date ? formatDate(formData.start_date) : null,
        end_date: formData.end_date ? formatDate(formData.end_date) : null,
      };

      const res = await fetch(`${RESOURCE_SERVER_URL}/edit_class`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!res.ok) {
        throw new Error("Server error");
      }

      const data = await res.json();

      if (data.meta.code !== "1000") {
        throw new Error(data.meta.message || "Unknown error occurred while editing class");
      }

      Toast.show({
        type: "success",
        text1: "Class updated successfully",
      });

      navigation.goBack();

    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const showEditConfirmation = () => {
    Alert.alert(
      "Confirm Edit",
      "Are you sure you want to update this class?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "Update",
          onPress: handleEditClass,
          style: "default"
        }
      ]
    );
  };


  if (classInfoLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading class info...</Text>
      </View>
    );
  }

  return (
    <Pressable onPress={() => {
      Keyboard.dismiss();
      setOpen(false);
    }}>
      <View className="w-full h-full bg-gray-50">
        <Topbar title='Edit Class' showBack={true}/>
        <SafeAreaView className="flex-1">
          <View className="px-6 py-4">
            <View className="space-y-4">
              {/* Class ID Field */}
              <View>
                <Text className="text-xl font-medium text-gray-700 mb-1">Class ID</Text>
                <TextInput
                  onFocus={() => setOpen(false)}
                  value={formData.class_id || ""}
                  onChangeText={(value) => handleChangeInput('class_id', value)}
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
                  placeholderTextColor="#9ca3af"
                />
              </View>

              {/* Class Name Field */}
              <View>
                <Text className="text-xl font-medium text-gray-700 mb-1">Class Name</Text>
                <TextInput
                  onFocus={() => setOpen(false)}
                  value={formData.class_name || ""}
                  onChangeText={(value) => handleChangeInput('class_name', value)}
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
                  placeholderTextColor="#9ca3af"
                />
              </View>

              {/* Status Dropdown */}
              <View>
                <Text className="text-2xl font-medium text-gray-700 mb-1">Status</Text>
                <DropDownPicker
                  open={open}
                  value={formData.status || ""}
                  items={[
                    { label: "Complete", value: "COMPLETE" },
                    { label: "Active", value: "ACTIVE" },
                    { label: "Upcoming", value: "UPCOMING" },
                  ]}
                  onOpen={() => Keyboard.dismiss()}
                  setOpen={setOpen}
                  setValue={(callback) => {
                    setFormData((prevState) => ({
                      ...prevState,
                      status: callback(prevState.status),
                    }));
                  }}
                  style={{
                    backgroundColor: 'white',
                    borderColor: '#d1d5db',
                    height: 48,
                    marginBottom: 4
                  }}
                  textStyle={{
                    fontSize: 16,
                    color: '#111827'
                  }}
                  dropDownContainerStyle={{
                    backgroundColor: 'white',
                    borderColor: '#d1d5db',
                  }}
                />
              </View>

              {/* Date Fields */}
              <View className="flex-row gap-4">
                <View className="flex-1">
                  <Text className="text-xl font-medium text-gray-700 mb-1">Start Date</Text>
                  <View className="bg-white border border-gray-300 rounded-lg px-4 py-3">
                    <DateTimePicker
                      value={formData.start_date}
                      mode="date"
                      display="default"
                      onChange={(event, date) => {
                        if (date) {
                          setFormData((prevState) => ({
                            ...prevState,
                            start_date: date,
                          }));
                        }
                      }}
                      style={{ height: 24 }}
                    />
                  </View>
                </View>

                <View className="flex-1">
                  <Text className="text-xl font-medium text-gray-700 mb-1">End Date</Text>
                  <View className="items-center bg-white border border-gray-300 rounded-lg px-4 py-3">
                    <DateTimePicker
                      value={formData.end_date}
                      mode="date"
                      display="default"
                      onChange={(event, date) => {
                        if (date) {
                          setFormData((prevState) => ({
                            ...prevState,
                            end_date: date,
                          }));
                        }
                      }}
                      style={{ height: 24 }}
                    />
                  </View>
                </View>
              </View>

              {/* Action Buttons */}
              <View className="flex-row gap-4 mt-8">
                <TouchableOpacity
                  className="flex-1 bg-red-50 py-3 rounded-lg border border-red-200"
                  onPress={showDeleteConfirmation}
                  disabled={loading}
                >
                  {!loading ? (
                    <Text className="text-xl text-red-600 text-center font-medium">Delete Class</Text>
                  ) : (
                    <ActivityIndicator size="small" color="#dc2626" />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  className="flex-1 bg-blue-600 py-3 rounded-lg"
                  onPress={showEditConfirmation}
                  disabled={loading}
                >
                  {!loading ? (
                    <Text className="text-xl text-white text-center font-medium">Update Class</Text>
                  ) : (
                    <ActivityIndicator size="small" color="white" />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </Pressable>
  );
};

export default EditClass;
