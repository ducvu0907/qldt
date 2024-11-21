import { Text, TouchableOpacity, View, Alert } from "react-native";
import * as Clipboard from 'expo-clipboard';
import { useNavigation } from "@react-navigation/native";
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Animated, { useAnimatedStyle, interpolate } from 'react-native-reanimated';
import { RESOURCE_SERVER_URL } from "../types";
import Toast from "react-native-toast-message";
import { useContext, useState, useRef } from "react";
import { AuthContext } from "../contexts/AuthContext";

export interface AssignmentItemData {
  id: number;
  title: string;
  description: string;
  lecturer_id: number;
  deadline: Date;
  file_url: string;
  class_id: string;
}

export interface AssignmentDeleteRequest {
  token: string;
  survey_id: string;
}

interface Props {
  assignment: AssignmentItemData;
  refetch: () => void;
}

const AssignmentItem: React.FC<Props> = ({ refetch, assignment }) => {
  const navigation = useNavigation<any>();
  const { token, role } = useContext(AuthContext);
  const [loading, setLoading] = useState<boolean>(false);
  const swipeableRef = useRef<any>(null);

  const closeSwipeable = () => {
    swipeableRef.current?.close();
  };

  const copyAssignmentFileToClipboard = async () => {
    await Clipboard.setStringAsync(assignment.file_url);
    Alert.alert("Success", "Assignment file URL copied to clipboard");
    closeSwipeable();
  };

  const showDeleteConfirmation = () => {
    Alert.alert(
      "Delete Assignment",
      `Are you sure you want to delete "${assignment.title}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: closeSwipeable
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

      if (data.meta.code !== "1000") {
        throw new Error(data.meta.message || "Error while deleting assignment");
      }

      Toast.show({
        type: "success",
        text1: "Assignment deleted successfully"
      });

      refetch();

    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: error.message,
      });
    } finally {
      setLoading(false);
      closeSwipeable();
    }
  };

  const renderRightActions = (
    progress: Animated.SharedValue<number>
  ) => {
    const animatedStyle = useAnimatedStyle(() => {
      const opacity = interpolate(
        progress.value,
        [0, 0.2],
        [0, 1]
      );
      return { opacity };
    });

    return (
      <Animated.View 
        style={[{ flexDirection: 'row' }, animatedStyle]}
        className="overflow-hidden"
      >
        <TouchableOpacity 
          onPress={() => {
            navigation.navigate("EditAssignment", { assignment });
            closeSwipeable();
          }}
          className="bg-yellow-500 justify-center w-20 opacity-90 active:opacity-100"
          disabled={loading}
        >
          <View className="items-center">
            <MaterialIcons name="edit" size={24} color="white" />
            <Text className="text-white text-xs mt-1 font-medium">Edit</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={showDeleteConfirmation}
          className="bg-red-500 justify-center w-20 opacity-90 active:opacity-100"
          disabled={loading}
        >
          <View className="items-center">
            <MaterialIcons name="delete" size={24} color="white" />
            <Text className="text-white text-xs mt-1 font-medium">Delete</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <>
      {role === "LECTURER" ? (
        <Swipeable
          ref={swipeableRef}
          renderRightActions={renderRightActions}
          rightThreshold={40}
          overshootRight={false}
          friction={1}
        >
          <View className="w-full p-5 bg-gray-700 rounded-xl shadow-xl my-2.5">
            <View className="space-y-3">
              <View className="flex-row justify-between items-center">
                <Text className="text-2xl font-bold text-white">
                  {assignment.title}
                </Text>
                <TouchableOpacity onPress={copyAssignmentFileToClipboard}>
                  <Ionicons name="copy" size={20} color={"white"}/>
                </TouchableOpacity>
              </View>
  
              <View className="flex-row justify-between items-center">
                <View className="bg-gray-600 px-3 py-1.5 rounded-full">
                  <Text className="text-sm text-white font-medium">
                    Due: {new Date(assignment.deadline).toLocaleDateString()}
                  </Text>
                </View>
              </View>
  
              <View className="flex-row justify-between">
                <Text className="text-sm text-gray-300">
                  Lecturer ID: {assignment.lecturer_id}
                </Text>
                <Text className="text-sm text-gray-300">
                  Class ID: {assignment.class_id}
                </Text>
              </View>
  
              <View className="bg-gray-600/50 p-3 rounded-lg mt-2">
                <Text className="text-sm text-gray-100 leading-5">
                  {assignment.description}
                </Text>
              </View>
            </View>
          </View>
        </Swipeable>
      ) : (
        <View className="w-full p-5 bg-gray-700 rounded-xl shadow-xl my-2.5">
          <View className="space-y-3">
            <View className="flex-row justify-between items-center">
              <Text className="text-2xl font-bold text-white">
                {assignment.title}
              </Text>
              <TouchableOpacity onPress={copyAssignmentFileToClipboard}>
                <Ionicons name="copy" size={20} color={"white"}/>
              </TouchableOpacity>
            </View>
  
            <View className="flex-row justify-between items-center">
              <View className="bg-gray-600 px-3 py-1.5 rounded-full">
                <Text className="text-sm text-white font-medium">
                  Due: {new Date(assignment.deadline).toLocaleDateString()}
                </Text>
              </View>
            </View>
  
            <View className="flex-row justify-between">
              <Text className="text-sm text-gray-300">
                Lecturer ID: {assignment.lecturer_id}
              </Text>
              <Text className="text-sm text-gray-300">
                Class ID: {assignment.class_id}
              </Text>
            </View>
  
            <View className="bg-gray-600/50 p-3 rounded-lg mt-2">
              <Text className="text-sm text-gray-100 leading-5">
                {assignment.description}
              </Text>
            </View>
          </View>
        </View>
      )}
    </>
  );
  
};

export default AssignmentItem;