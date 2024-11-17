import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Modal, Pressable } from 'react-native';
import Topbar from "../../components/Topbar";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../contexts/AuthContext';
import { RESOURCE_SERVER_URL } from '../../types';
import { ClassContext } from '../../contexts/ClassContext';
import Toast from 'react-native-toast-message';

const ClassMain = () => {
  const { token } = useContext(AuthContext);
  const { selectedClassId } = useContext(ClassContext);
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility

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

      if (data.meta.code !== 1000) {
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
      setModalVisible(false); // Close modal after action
      navigation.goBack();
    }
  };

  return (
    <View className="flex-1 bg-white">
      <Topbar title="Class Management" showBack={true} />

      <View className="flex-1 p-4 justify-evenly">
        <View className="flex-row flex-wrap justify-between items-center space-y-4">
          <TouchableOpacity 
            className="flex justify-center items-center w-1/2 h-48 bg-blue-500 rounded-lg"
            onPress={() => navigation.navigate("EditClass")}
          >
            <Ionicons name="create" size={40} color="white" />
            <Text className="mt-2 text-white text-center">Edit Class</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className="flex justify-center items-center w-1/2 h-48 bg-green-500 rounded-lg"
            onPress={() => navigation.navigate("AddStudent")}
          >
            <Ionicons name="person-add" size={40} color="white" />
            <Text className="mt-2 text-white text-center">Add Student</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className="flex justify-center items-center w-1/2 h-48 bg-yellow-500 rounded-lg"
            onPress={() => navigation.navigate("ClassDetailsInfo")}
          >
            <Ionicons name="information-circle" size={40} color="white" />
            <Text className="mt-2 text-white text-center">Details Info</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className="flex justify-center items-center w-1/2 h-48 bg-purple-500 rounded-lg"
            onPress={() => navigation.navigate("ViewStudents")}
          >
            <Ionicons name="people" size={40} color="white" />
            <Text className="mt-2 text-white text-center">View Students</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="p-4 flex items-center">
        <TouchableOpacity 
          className="flex justify-center items-center w-16 h-16 bg-red-500 rounded-full"
          onPress={() => setModalVisible(true)}
          disabled={loading}
        >
          {!loading ? <Ionicons name="trash-bin" size={24} color="white" /> : <ActivityIndicator size={24} />}
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black opacity-50">
          <View className="bg-white p-6 rounded-lg w-80">
            <Text className="text-lg text-center mb-6">Are you sure you want to delete this class?</Text>
            <View className="flex-row justify-between space-x-4">
              <Pressable 
                onPress={() => setModalVisible(false)}
                className="bg-gray-400 p-3 rounded-lg flex-1"
              >
                <Text className="text-white text-center">Cancel</Text>
              </Pressable>
              <Pressable 
                onPress={handleDeleteClass}
                className="bg-red-500 p-3 rounded-lg flex-1"
              >
                <Text className="text-white text-center">Delete</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ClassMain;
