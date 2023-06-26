import React, { useState } from "react";
import {
  Text,
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Yup from "yup";
import { useFormik } from "formik";
import tw from "twrnc";

import Button from "../../../components/button";
import Input from "../../../components/input";
import API_URL, { sendRequest } from "../../../config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fields = [
    {
      icon: <Feather name="mail" size={24} color="silver" />,
      placeholder: "Email",
      value: "email",
      secure: false,
      type: "email-address",
    },
    {
      icon: <Feather name="lock" size={24} color="silver" />,
      placeholder: "Password",
      value: "password",
      secure: true,
    },
  ];

  const initialValues = fields.reduce((acc, field) => {
    acc[field.value] = "";
    return acc;
  }, {});

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
  });

  const { handleChange, handleBlur, values, errors, touched, resetForm } =
    formik;

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await sendRequest(
        API_URL + "/users/login",
        "POST",
        values
      );
      if (response?.data?.status == 200) {
        setLoading(false);
        const token = response?.data?.data?.access_token;

        await AsyncStorage.setItem("token", token);
        navigation.navigate("App");
        resetForm();
      } else {
        return setError(
          response?.data?.message || "Error occurred while logging in"
        );
      }
    } catch (error) {
      setLoading(false);
      return setError(error?.response?.data?.message || "An error occurred");
    }
  };

  return (
    <View style={tw`h-[100%] bg-white justify-end items-center`}>
      <SafeAreaView style={tw`h-[85%] w-full bg-white`}>
        <ScrollView>
          <View>
            <View style={tw`w-full`}>
              <Text
                style={tw`text-[#223458] text-center font-extrabold text-xl`}
              >
                EUCL Token System
              </Text>
            </View>

            {error.length > 0 && (
              <Text style={tw`mt-4 text-red-500 text-center`}>{error}</Text>
            )}
            <View style={tw`mt-8`}>
              <View style={tw`px-6 py-2`}>
                {fields.map((field, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {}}
                    activeOpacity={0.8}
                  >
                    <Input
                      Icon={field.icon}
                      placeholder={field.placeholder}
                      onChangeText={handleChange(field.value)}
                      onBlur={handleBlur(field.value)}
                      value={values[field.value]}
                      security={field.secure}
                      type={field?.type}
                      style={[
                        styles.input,
                        touched[field.value] && errors[field.value] && styles.inputError,
                      ]}
                    />
                    {touched[field.value] && errors[field.value] && (
                      <Text style={tw`text-red-500`}>
                        {errors[field.value]}
                      </Text>
                    )}
                  </TouchableOpacity>
                ))}

                <View style={tw`mt-8`}>
                  <Button
                    mode={"contained"}
                    style={styles.button}
                    onPress={handleSubmit}
                  >
                    {loading ? "Logging in..." : "Login"}
                  </Button>

                  <TouchableOpacity
                    onPress={() => navigation.navigate("Register")}
                  >
                    <View style={tw`mt-4`}>
                      <Text style={tw`text-base underline text-gray-500`}>
                        Don&rsquo;t have an account? Register
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4F4",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  safeArea: {
    flex: 1,
    width: "100%",
    backgroundColor: "#F4F4F4",
  },
  content: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  titleContainer: {
    width: "100%",
    marginBottom: 20,
    alignItems: "center",
  },
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#223458",
    marginTop: 10,
  },
  errorText: {
    marginTop: 10,
    textAlign: "center",
    color: "red",
  },
  fieldsContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
    borderRadius: 10,
    backgroundColor: "white",
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 30,
    padding: 10,
    marginBottom: 10,
  },
  inputError: {
    borderColor: "red",
  },
  buttonContainer: {
    marginTop: 20,
  },
  button: {
    paddingVertical: 10,
    marginTop: 10,
    borderRadius: 30,
    backgroundColor: "dodgerblue",
  },
  tokenContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  tokenText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#223458",
    marginBottom: 10,
  },
  tokensContainer: {
    marginTop: 20,
  },
});

export default Login;
