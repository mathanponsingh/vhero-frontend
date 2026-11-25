import { login } from "@/api/authentication";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, Pressable,ActivityIndicator  } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";


export default function HomePage() {
  const [email, set_email] = useState("");
  const [loading,set_lodaing] = useState(false)
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleContinue = async() => {
    const trimmedText = email.trim();
    if (!trimmedText) {
      Toast.show({type:'error',text1:'Email is required'});
    } else if (!emailRegex.test(trimmedText)) {
      Toast.show({type:'error' ,text1:'Please enter a valid email address'});
    } else {
      try{
        set_lodaing(true)
        const data = await login(email)
        Toast.show({type:'success',text1:data.message})
        router.push({
          pathname:'/verify-otp',
          params:{'email':email}
        })
      }catch(err:any){
        Toast.show({type:'error',text1:err.message ?? "Something went wrong"});
      }finally{
        set_lodaing(false)
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}></Text>
        <TextInput
          style={styles.input}
          placeholder="Email to login"
          placeholderTextColor="#999"
          keyboardType="email-address"
          onChangeText={set_email}
          value={email}
        />
        <Pressable
            style={({ pressed }) => [
              styles.button,
              loading && styles.buttonLoading,
              pressed && !loading && { opacity: 0.7 },
            ]}
            onPress={handleContinue}
            disabled={loading}
          >
            {loading ? (
              <View style={styles.row}>
                <ActivityIndicator size="small" color="#fff" />
                <Text style={styles.buttonText}>Sending OTP...</Text>
              </View>
            ) : (
              <Text style={styles.buttonText}>Continue with email address</Text>
            )}
          </Pressable>
        
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff"},
  inner: { flex: 1, justifyContent: "center", padding: 24, flexDirection:'column', gap:5 },
  title: { color: "#000", fontSize: 24, marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    height: 50,
    paddingHorizontal: 12,
    fontSize: 16,
    color: "#000",
  },
  button: {
    backgroundColor: "#1E90FF",
    height: 50,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  buttonLoading: {
    backgroundColor: "#9CC9F5",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});