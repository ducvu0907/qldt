import { LoginRequest } from "../screens/auth/Login";
import { SignupRequest } from "../screens/auth/Signup";
import Toast from "react-native-toast-message";

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