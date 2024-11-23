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
      <View className="w-full h-full bg-red-700 justify-around">
        <SafeAreaView style={{ flex: 1 }}>
          <View className="flex items-center mt-22 mb-10">
            <Logo />
          </View>

          <View className="w-full justify-center items-center px-8">
            <Text className="text-white text-4xl mb-12">Edit Class</Text>
            <View className="w-full space-y-4 mb-6">
              <TextInput
                onFocus={() => setOpen(false)}
                placeholder="Class Id"
                value={formData.class_id || ""}
                onChangeText={(value) => handleChangeInput('class_id', value)}
                placeholderTextColor="#ffffff80"
                className="border-2 border-white text-2xl rounded-lg p-3 text-white w-full mb-4"
              />

              <TextInput
                onFocus={() => setOpen(false)}
                placeholder="Class Name"
                value={formData.class_name || ""}
                onChangeText={(value) => handleChangeInput('class_name', value)}
                placeholderTextColor="#ffffff80"
                className="border-2 border-white text-2xl rounded-lg p-3 text-white w-full mb-4"
              />

              <DropDownPicker
                open={open}
                value={formData.status || ""}
                items={[
                  { label: "Complete", value: "COMPLETE", labelStyle:{color: "#000"} },
                  { label: "Active", value: "ACTIVE", labelStyle: {color: "#000"}},
                  { label: "Upcoming", value: "UPCOMING", labelStyle: {color: "#000"}},
                ]}
                onOpen={() => Keyboard.dismiss()}
                setOpen={setOpen}
                setValue={(callback) => {
                  setFormData((prevState) => ({
                    ...prevState,
                    status: callback(prevState.status),
                  }));
                }}
                placeholder="Status"
                style={{
                  height: 55,
                  backgroundColor: 'transparent',
                  borderColor: 'rgba(255, 255, 255, 1.0)',
                  borderWidth: 2,
                  marginBottom: 12,
                }}
                textStyle={{
                  color: 'white',
                  fontSize: 24
                }}
                placeholderStyle={{
                  color: '#ffffff80'
                }}
                dropDownContainerStyle={{
                  backgroundColor: '#ffffff',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                }}
                theme="DARK"
              />

              <View className="flex-row items-center border-2 border-white rounded-lg py-2 w-full mb-4">
                <Text className="text-white text-2xl pl-3">Start Date:</Text>
                <DateTimePicker
                  value={formData.start_date}
                  mode="date"
                  is24Hour={true}
                  display="default"
                  onChange={(event, date) => {
                    if (date) {
                      setFormData((prevState) => ({
                        ...prevState,
                        start_date: date,
                      }));
                    }
                  }}
                  themeVariant='dark'
                  style={{
                    flex: 1,
                    marginRight: 15,
                  }}
                />
              </View>

              <View className="flex-row items-center border-2 border-white rounded-lg py-2 w-full mb-4">
                <Text className="text-white text-2xl pl-3">End Date:</Text>
                <DateTimePicker
                  value={formData.end_date}
                  mode="date"
                  is24Hour={true}
                  display="default"
                  onChange={(event, date) => {
                    if (date) {
                      setFormData((prevState) => ({
                        ...prevState,
                        end_date: date,
                      }));
                    }
                  }}
                  themeVariant='dark'
                  style={{
                    flex: 1,
                    marginRight: 15,
                  }}
                />
              </View>
            </View>

            <View className={`w-full items-center`}>
              <View className='w-full flex-row justify-evenly'>
              <TouchableOpacity
                className="bg-red-800 w-2/5 py-4 rounded-full items-center mb-5"
                onPress={showDeleteConfirmation}
                disabled={loading}
              >
                {!loading ? <Text className="text-white text-2xl font-bold text-center">Delete Class</Text> : <ActivityIndicator size={20} />}
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-white w-2/5 py-4 rounded-full items-center mb-5"
                onPress={showEditConfirmation}
                disabled={loading}
              >
                {!loading ? <Text className="text-blue-500 text-2xl font-bold text-center">Update Class</Text> : <ActivityIndicator size={20} />}
              </TouchableOpacity>
              </View>

              <TouchableOpacity className="items-center" onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back-outline" size={30} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </Pressable>
  );
};

export default EditClass;
