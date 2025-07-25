import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import StarWrapper from '@/components/layout/AppWrapper';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Toast from 'react-native-root-toast';

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateInputs = () => {
    const newErrors: any = {};
    if (!email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email address.';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = () => {
    if (!validateInputs()) return;

    setTimeout(() => {
      Toast.show('Login successful!', {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
        shadow: true,
        animation: true,
      });
    }, 100);

    
    setTimeout(() => {
      setEmail("")
      setPassword("")
      router.push('/home');
    }, 2100);
    


    console.log('Logging in with:', { email, password });
  };

  return (
    <StarWrapper>
      <View style={styles.container}>
        <Text style={styles.title}>Login Here</Text>
        <Text style={styles.subtitle}>Welcome Back, You Have Been Missed</Text>

        {/* Email Field */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <View style={[styles.blurContainer, errors.email && styles.errorBorder]}>
            <BlurView intensity={40} tint="extraLight" style={styles.blurView}>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#fff"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </BlurView>
          </View>
          {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
        </View>

        {/* Password Field */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <View style={[styles.blurContainer, errors.password && styles.errorBorder]}>
            <BlurView intensity={40} tint="extraLight" style={styles.blurView}>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  placeholder="Enter your password"
                  placeholderTextColor="#fff"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
                  <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </BlurView>
          </View>
          {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

          <TouchableOpacity onPress={() => router.push('/(pages)/forgotpassword')}>
            <Text style={styles.forgotPassword}>Forgot your password?</Text>
          </TouchableOpacity>
        </View>

        {/* Sign In Button */}
        <TouchableOpacity style={styles.buttonContainer} onPress={handleLogin}>
          <LinearGradient
            colors={['#f4a51c', '#c822ff']}
            style={styles.button}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.buttonText}>Sign In</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Create Account */}
        <TouchableOpacity onPress={() => router.push('/(pages)/signup')}>
          <Text style={styles.createAccount}>Create new account</Text>
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
    marginBottom: 20,
  },
  label: {
    color: '#fff',
    marginBottom: 5,
    fontFamily: 'Lora-Bold',
  },
  blurContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  errorBorder: {
    borderColor: '#ff6b6b',
  },
  blurView: {
    padding: 2,
  },
  input: {
    color: '#fff',
    height: 50,
    paddingHorizontal: 16,
    borderRadius: 60,
    fontFamily: 'Lora-Regular',
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
  },
  eyeIcon: {
    padding: 10,
  },
  forgotPassword: {
    color: '#fcb900',
    fontSize: 15,
    marginTop: 6,
    textAlign: 'right',
    fontFamily: 'Lora-Regular',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 13,
    fontFamily: 'Lora-Regular',
    marginTop: 6,
  },
  buttonContainer: {
    marginTop: 20,
    borderRadius: 60,
    overflow: 'hidden',
    width: 300,
    alignSelf: 'center',
  },
  button: {
    paddingVertical: 14,
    borderRadius: 60,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Lora-Bold',
  },
  createAccount: {
    textAlign: 'center',
    color: '#fcb900',
    marginTop: 20,
    fontFamily: 'Lora-Regular',
    fontSize: 15,
  },
});
