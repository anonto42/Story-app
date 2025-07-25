import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import StarWrapper from '@/components/layout/AppWrapper';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

type OtpArray = [string, string, string, string];

export default function OtpVerificationScreen() {
  const [otp, setOtp] = useState<OtpArray>(['', '', '', '']);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [resendTimer, setResendTimer] = useState<number>(30);
  const router = useRouter();
  const inputRefs = useRef<(TextInput | null)[]>(Array(4).fill(null));

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleChange = (text: string, index: number) => {
    const numericText = text.replace(/[^0-9]/g, '');
    const newOtp = [...otp] as OtpArray;
    newOtp[index] = numericText;
    setOtp(newOtp);
    setError('');

    if (numericText && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (index: number, key: string) => {
    if (key === 'Backspace' && index > 0 && otp[index] === '') {
      const newOtp = [...otp] as OtpArray;
      newOtp[index - 1] = '';
      setOtp(newOtp);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const code = otp.join('');
    
    if (code.length !== 4) {
      setError('Please enter a 4-digit code');
      return;
    }

    setError('');
    console.log('Verifying OTP:', code);
    setIsVerified(true);

    setTimeout(() => {
      router.push('/(tabs)/home'); 
    }, 1500);
  };

  const handleResend = () => {
    setResendTimer(30);
    setOtp(['', '', '', '']);
    setError('');
    inputRefs.current[0]?.focus();
    console.log('Resending OTP...');
  };

  return (
    <StarWrapper>
      <View style={styles.container}>
        <Text style={styles.title}>Verify OTP</Text>
        <Text style={styles.subtitle}>
          {isVerified 
            ? "Verification successful!"
            : "Enter the 4-digit code sent to your email"}
        </Text>

        {!isVerified ? (
          <>
            <View style={styles.otpContainer}>
              {[0, 1, 2, 3].map((index) => (
                <View key={index} style={styles.otpInputWrapper}>
                  <BlurView intensity={40} tint="extraLight" style={styles.blurView}>
                    <TextInput
                      //@ts-ignore
                      ref={(ref) => (inputRefs.current[index] = ref)}
                      style={styles.otpInput}
                      keyboardType="number-pad"
                      keyboardAppearance="dark"
                      autoComplete="one-time-code"
                      maxLength={1}
                      value={otp[index]}
                      onChangeText={(text) => handleChange(text, index)}
                      onKeyPress={({ nativeEvent }) => handleBackspace(index, nativeEvent.key)}
                      selectTextOnFocus
                    />
                  </BlurView>
                </View>
              ))}
            </View>

            {error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : null}

            <TouchableOpacity 
              style={styles.buttonContainer}
              onPress={handleVerify}
              disabled={otp.some(digit => digit === '')}
            >
              <LinearGradient 
                colors={['#f4a51c', '#c822ff']} 
                style={[styles.button, otp.some(digit => digit === '') && styles.disabledButton]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.buttonText}>Verify</Text>
              </LinearGradient>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.successContainer}>
            <Ionicons name="checkmark-circle" size={60} color="#4CAF50" style={styles.successIcon} />
            <Text style={styles.successText}>Your account has been verified!</Text>
          </View>
        )}

        <TouchableOpacity 
          style={styles.resendContainer}
          onPress={handleResend}
          disabled={resendTimer > 0}
        >
          <Text style={styles.resendText}>
            Didn't receive code?{' '}
            {resendTimer > 0 ? (
              <Text style={styles.timerText}>({resendTimer}s)</Text>
            ) : (
              <Text style={styles.resendLink}>Resend</Text>
            )}
          </Text>
        </TouchableOpacity>
      </View>
    </StarWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontFamily: "Lora-Bold",
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#ccc',
    fontFamily: "Lora-Regular",
    textAlign: 'center',
    marginBottom: 32,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  otpInputWrapper: {
    width: '20%',
    aspectRatio: 1,
    borderRadius: 10,
    overflow: 'hidden',
    marginHorizontal: '1%',
  },
  blurView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpInput: {
    width: '100%',
    height: '100%',
    color: '#fff',
    fontSize: 24,
    textAlign: 'center',
    fontFamily: "Lora-Bold",
  },
  buttonContainer: {
    marginTop: 20,
    borderRadius: 30,
    overflow: 'hidden',
  },
  button: {
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontFamily: "Lora-Bold",
  },
  successContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  successIcon: {
    marginBottom: 20,
  },
  successText: {
    color: '#fff',
    fontFamily: "Lora-Regular",
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  resendText: {
    color: '#ccc',
    fontFamily: "Lora-Regular",
  },
  resendLink: {
    color: '#fcb900',
    fontFamily: "Lora-Bold",
    textDecorationLine: 'underline',
  },
  timerText: {
    color: '#aaa',
    fontFamily: "Lora-Regular",
  },
  errorText: {
    color: '#ff5252',
    fontFamily: "Lora-Regular",
    textAlign: 'center',
    marginBottom: 15,
  },
});