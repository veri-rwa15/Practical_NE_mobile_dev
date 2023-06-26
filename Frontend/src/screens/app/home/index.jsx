import React, { useState } from "react";
import {
  Text,
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import * as Yup from "yup";
import { useFormik } from "formik";

import Button from "../../../components/button";
import Input from "../../../components/input";
import API_URL, { sendRequest } from "../../../config/api";

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [tokenValueDays, setTokenValueDays] = useState("");
  const [hasFinishedToFetchData, setHasFinishedToFetchData] = useState(false);
  const [tokens, setTokens] = useState([]);
  const [hasFinishedToFetchTokens, setHasFinishedToFetchTokens] = useState(false);

  const fields = [
    {
      placeholder: "Meter Number",
      value: "meter_number",
      secure: false,
      type: "number-pad",
    },
    {
      placeholder: "Amount",
      value: "amount",
      type: "number-pad",
      secure: false,
    },
  ];

  const initialValues = fields.reduce((acc, field) => {
    acc[field.value] = "";
    return acc;
  }, {});

  const validationSchema = Yup.object().shape({
    meter_number: Yup.string()
      .required("Meter number is required")
      .length(6, "Meter number must be exactly 6 digits"),
    amount: Yup.number()
      .min(100, "Amount less than 100 is not allowed")
      .required("Amount is required"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });

  const {
    handleChange,
    handleBlur,
    handleSubmit: formikHandleSubmit,
    values,
    errors,
    touched,
    resetForm,
  } = formik;

  const handleOnPress = async () => {
    setError("");

    try {
      const res = await sendRequest(API_URL + `/tokens/${values.meter_number}`, "GET");

      if (res?.data?.status == 200) {
        setHasFinishedToFetchTokens(true);
        setTokens(res?.data?.data || []);
      } else {
        setError(res?.data?.message || "Error occurred while searching for tokens");
      }
    } catch (error) {
      setError(error?.response?.data?.message || "An error occurred");
      console.log("error", error);
    }
  };

  async function handleSubmit() {
    setLoading(true);
    setError("");

    try {
      const response = await sendRequest(API_URL + "/tokens/buy", "POST", values);

      if (response?.data?.status == 200) {
        setLoading(false);
        setHasFinishedToFetchData(true);
        setToken(response?.data?.data?.token);
        setTokenValueDays(response?.data?.data?.token_value_days);
        resetForm();
      } else {
        setError(response?.data?.message || "Error occurred while buying power");
      }
    } catch (error) {
      setError(error?.response?.data?.message || "An error occurred");
      console.log("error", error);
    }
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView>
          <View style={styles.content}>
            <View style={styles.titleContainer}>
              <Text style={styles.titleText}>Buy Electricity</Text>
            </View>

            {error.length > 0 && (
              <Text style={styles.errorText}>{error}</Text>
            )}

            <View style={styles.fieldsContainer}>
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
                    <Text style={styles.errorText}>{errors[field.value]}</Text>
                  )}
                </TouchableOpacity>
              ))}

              <View style={styles.buttonContainer}>
                <Button
                  mode="contained"
                  style={styles.button}
                  onPress={formikHandleSubmit}
                >
                  {loading ? "Buying..." : "Buy"}
                </Button>
              </View>

              <View style={styles.tokenContainer}>
                {hasFinishedToFetchData && (
                  <>
                    <Text style={styles.tokenText}>Your token is {token}</Text>
                    <Text style={styles.tokenText}>Lighting Days {tokenValueDays}</Text>
                  </>
                )}
              </View>

              <Button
                mode="contained"
                style={styles.button}
                onPress={handleOnPress}
              >
                {loading ? "Getting tokens..." : "Get tokens"}
              </Button>
            </View>

            <View style={styles.tokensContainer}>
              {hasFinishedToFetchTokens && tokens.length === 0 ? (
                <Text>No tokens found</Text>
              ) : (
                tokens.map((token, index) => (
                  <Text key={index}>{token?.token}</Text>
                ))
              )}
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

export default Home;
