import { router, useLocalSearchParams } from 'expo-router';
import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  SafeAreaView,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { OTP_LENGTH, RESEND_SECONDS } from '@/constants/value';
import Toast from 'react-native-toast-message';
import * as SecureStore from 'expo-secure-store'
import { login, verify_otp } from '@/api/authentication';

const OtpPage = () => {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [focused, setFocused] = useState(true);
  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const inputRef = useRef<TextInput>(null);

  const handleChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '').slice(0, OTP_LENGTH);
    setOtp(cleaned);
    if (cleaned.length === OTP_LENGTH) {
      handleVerify(cleaned);
    }
  };
  const isRunning = seconds > 0;

  useEffect(() => {
    if (seconds <= 0) return;
    const id = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [seconds]);

  const handleResend = async() =>{
    try{
      const data = await login(email)
      Toast.show({type:'success',text1:data.message})
      setSeconds(RESEND_SECONDS);
    }catch(e:any){
      Toast.show({type:'error',text1:e.message ?? "Somthing went wrong"})
    }
    inputRef.current?.focus();
  }

  const handleVerify = async (code: string = otp) => {
    try {
      setLoading(true);
      const data = await verify_otp(email,Number(code))
      Toast.show({type:'success',text1:data.message})
      SecureStore.setItem("access_token",data.token)
      router.push({
        pathname:'/Home'
      })
    } catch (err:any) {
      Toast.show({type:'error',text1:err.message ?? "Something went wrong"})
      setOtp('');
      inputRef.current?.focus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Verify your email</Text>
        <Text style={styles.subtitle}>
          Enter the 6-digit code sent to{'\n'}
          <Text style={styles.email}>{email}</Text>
        </Text>

        <Pressable
          onPress={() => inputRef.current?.focus()}
          style={styles.boxesRow}
        >
          {Array.from({ length: OTP_LENGTH }).map((_, i) => {
            const digit = otp[i] ?? '';
            const isActive =
              focused && (i === otp.length || (i === OTP_LENGTH - 1 && otp.length === OTP_LENGTH));
            return (
              <View
                key={i}
                style={[
                  styles.box,
                  digit ? styles.boxFilled : null,
                  isActive ? styles.boxActive : null,
                ]}
              >
                <Text style={styles.digit}>{digit}</Text>
              </View>
            );
          })}
        </Pressable>

        <TextInput
          ref={inputRef}
          value={otp}
          onChangeText={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          maxLength={OTP_LENGTH}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          autoComplete="sms-otp"
          autoFocus
          caretHidden
          style={styles.hiddenInput}
        />

        <Pressable
          style={[
            styles.button,
            (otp.length !== OTP_LENGTH || loading) && styles.buttonDisabled,
          ]}
          disabled={otp.length !== OTP_LENGTH || loading}
          onPress={() => handleVerify()}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Verify</Text>
          )}
        </Pressable>

        <Pressable disabled={isRunning} onPress={() => {handleResend()}}>
          {isRunning ? <Text style={styles.resend}>Resend the OTP after {seconds}sec</Text> :<Text style={styles.resend}>Didn't get the code? Resend</Text>}
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default OtpPage;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  email: {
    color: '#111',
    fontWeight: '600',
  },
  boxesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 360,
    marginBottom: 32,
  },
  box: {
    width: 48,
    height: 56,
    borderWidth: 1.5,
    borderColor: '#d1d5db',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9fafb',
  },
  boxFilled: {
    borderColor: '#6b7280',
    backgroundColor: '#fff',
  },
  boxActive: {
    borderColor: '#4f46e5',
    borderWidth: 2,
  },
  digit: {
    fontSize: 22,
    fontWeight: '600',
    color: '#111',
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: 1,
    height: 1,
  },
  button: {
    width: '100%',
    maxWidth: 360,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#4f46e5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resend: {
    marginTop: 20,
    color: '#4f46e5',
    fontSize: 14,
    fontWeight: '500',
  },
});