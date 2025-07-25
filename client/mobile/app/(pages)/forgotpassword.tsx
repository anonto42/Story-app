import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import StarWrapper from '@/components/layout/AppWrapper';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      setError('Email is required.');
      return;
    } else if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setError('');
    console.log('Password reset requested for:', email);
    setIsSubmitted(true);

    setTimeout(() => {
      router.push('/(pages)/verifyotp');
    }, 2000);
  };

  return (
    <StarWrapper>
      <View style={styles.container}>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>
          {isSubmitted
            ? "We've sent a password reset link to your email"
            : "Enter your email to receive a reset link"}
        </Text>

        {!isSubmitted ? (
          <>
            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email Address</Text>
              <View style={[styles.blurContainer, error && styles.inputErrorBorder]}>
                <BlurView intensity={40} tint="extraLight" style={styles.blurView}>
                  <TextInput
                    style={styles.input}
                    placeholder="your@email.com"
                    placeholderTextColor="#fff"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </BlurView>
              </View>
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={handleSubmit}
              disabled={!email}
            >
              <LinearGradient
                colors={['#f4a51c', '#c822ff']}
                style={[styles.button, !email && styles.disabledButton]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.buttonText}>Send Reset Link</Text>
              </LinearGradient>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.successContainer}>
            <Ionicons name="mail-open-outline" size={60} color="#f4a51c" style={styles.successIcon} />
            <Text style={styles.successText}>Check your inbox for further instructions</Text>
          </View>
        )}

        <TouchableOpacity onPress={() => router.push('/(pages)/signin')} style={styles.backToLoginContainer}>
          <Text style={styles.backToLoginText}>Back to Login</Text>
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
    fontFamily: 'Lora-Bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#ccc',
    fontFamily: 'Lora-Regular',
    textAlign: 'center',
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 25,
  },
  label: {
    color: '#fff',
    marginBottom: 8,
    fontFamily: 'Lora-Bold',
    fontSize: 15,
  },
  blurContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  blurView: {
    padding: 2,
  },
  input: {
    color: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    fontFamily: 'Lora-Regular',
    fontSize: 15,
  },
  inputErrorBorder: {
    borderColor: '#ff6b6b',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 13,
    fontFamily: 'Lora-Regular',
    marginTop: 6,
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
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontFamily: 'Lora-Bold',
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
    fontFamily: 'Lora-Regular',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  backToLoginContainer: {
    marginTop: 30,
    alignSelf: 'center',
  },
  backToLoginText: {
    color: '#fcb900',
    fontFamily: 'Lora-Bold',
    fontSize: 15,
    textDecorationLine: 'underline',
  },
});
