import { LoginRequest } from "../screens/auth/Login";
import { SignupRequest } from "../screens/auth/Signup";
import Toast from "react-native-toast-message";
import { ClassCreateRequest } from "../screens/home/CreateClass";
import { EditClassRequest } from "../screens/class/EditClass";
import { CreateAssignmentRequest } from "../screens/assignment/CreateAssignment";

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

export const validateSignupInputs = (formData: SignupRequest) => {
  if (formData.firstName === '') {
    Toast.show({
      type: "error",
      text1: 'First name is required',
    });
    return false;
  }

  if (formData.lastName === '') {
    Toast.show({
      type: "error",
      text1: 'Last name is required',
    });
    return false;
  }

  if (formData.email === '') {
    Toast.show({
      type: "error",
      text1: 'Email is required',
    });
    return false;
  }

  if (!isValidEmail(formData.email)) {
    Toast.show({
      type: "error",
      text1: 'Please enter a valid email address',
    });
    return false;
  }

  if (formData.password === '') {
    Toast.show({
      type: "error",
      text1: 'Password is required',
    });
    return false;
  }

  if (formData.password.length < 6) {
    Toast.show({
      type: "error",
      text1: 'Password must be at least 6 characters long',
    });
    return false;
  }

  return true;
};

export const validateLoginInputs = (formData: LoginRequest) => {
  if (formData.email === '') {
    Toast.show({
      type: "error",
      text1: 'Email is required',
    });
    return false;
  }

  if (!isValidEmail(formData.email)) {
    Toast.show({
      type: "error",
      text1: 'Please enter a valid email address',
    });
    return false;
  }

  if (formData.password.length < 6) {
    Toast.show({
      type: "error",
      text1: 'Password must be at least 6 characters long',
    });
    return false;
  }

  return true;
};

export const validateClassInputs = (formData: ClassCreateRequest): boolean => {
  const { class_id, class_name, class_type, start_date, end_date, max_student_amount } = formData;

  if (class_name.trim() === '') {
    Toast.show({
      type: "error",
      text1: "Class Name cannot be empty.",
    });
    return false;
  }

  if (start_date >= end_date) {
    Toast.show({
      type: "error",
      text1: "Start Date must be before End Date.",
    });
    return false;
  }

  return true;
};

// format to yyyy-mm-dd
export const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const validateAssignmentInputs = (formData: CreateAssignmentRequest): boolean => {
  const { file, classId, title, description, deadline } = formData;

  if (!classId || classId.trim().length === 0) {
    Toast.show({
      type: "error",
      text1: "Class ID is required.",
    });
    return false;
  }

  if (!title || title.trim().length === 0) {
    Toast.show({
      type: "error",
      text1: "Assignment title is required.",
    });
    return false;
  }

  if (!deadline || deadline.getTime() < new Date().getTime()) {
    Toast.show({
      type: "error",
      text1: "Deadline must be a future date.",
    });
    return false;
  }

  if (!file && !description) {
    Toast.show({
      type: "error",
      text1: "A file or description must be given.",
    });
    return false;
  }

  return true;
};

export const formatDateTime = (date: Date): string => {
  const isoString = date.toISOString();
  const formatted = isoString.slice(0, 19);

  return formatted;
};
