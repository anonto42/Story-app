import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import StarWrapper from '@/components/layout/AppWrapper';
import { useRouter } from 'expo-router';

export default function SignUpScreen() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    location: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    email: '',
    location: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (name: string, value: string | boolean) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required.';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required.';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid.';
    }
    if (!formData.location.trim()) newErrors.location = 'Location is required.';
    if (!formData.password) newErrors.password = 'Password is required.';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters.';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirm your password.';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    console.log('Form submitted:', formData);
  };

  return (
    <StarWrapper>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join us to get started</Text>

          {/* Input Fields */}
          {[
            { label: 'Full Name', name: 'name', placeholder: 'John Doe' },
            { label: 'Phone Number', name: 'phone', placeholder: '+1 234 567 8900', keyboardType: 'phone-pad' },
            { label: 'Email', name: 'email', placeholder: 'example@email.com', keyboardType: 'email-address' },
            { label: 'Location', name: 'location', placeholder: 'City, Country' }
          ].map(({ label, name, placeholder, keyboardType }) => (
            <View key={name} style={styles.inputContainer}>
              <Text style={styles.label}>{label}</Text>
              {/* @ts-ignore */}
              <View style={[styles.blurContainer, errors[name] && styles.errorBorder]}>
                <BlurView intensity={40} tint="extraLight" style={styles.blurView}>
                  <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    placeholderTextColor="#fff"
                    // @ts-ignore
                    value={formData[name]}
                    onChangeText={(text) => handleChange(name, text)}
                    keyboardType={keyboardType as any}
                    autoCapitalize="none"
                  />
                </BlurView>
              </View>
              {/* @ts-ignore */}
              {errors[name] ? <Text style={styles.errorText}>{errors[name]}</Text> : null}
            </View>
          ))}

          {/* Password */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={[styles.blurContainer, errors.password && styles.errorBorder]}>
              <BlurView intensity={40} tint="extraLight" style={styles.blurView}>
                <View style={styles.passwordInputContainer}>
                  <TextInput
                    style={[styles.input, styles.passwordInput]}
                    placeholder="Password"
                    placeholderTextColor="#fff"
                    secureTextEntry={!showPassword}
                    value={formData.password}
                    onChangeText={(text) => handleChange('password', text)}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                    <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
              </BlurView>
            </View>
            {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
          </View>

          {/* Confirm Password */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm Password</Text>
            <View style={[styles.blurContainer, errors.confirmPassword && styles.errorBorder]}>
              <BlurView intensity={40} tint="extraLight" style={styles.blurView}>
                <View style={styles.passwordInputContainer}>
                  <TextInput
                    style={[styles.input, styles.passwordInput]}
                    placeholder="Confirm Password"
                    placeholderTextColor="#fff"
                    secureTextEntry={!showConfirmPassword}
                    value={formData.confirmPassword}
                    onChangeText={(text) => handleChange('confirmPassword', text)}
                  />
                  <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
                    <Ionicons name={showConfirmPassword ? 'eye-off' : 'eye'} size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
              </BlurView>
            </View>
            {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}
          </View>

          {/* Terms & Conditions */}
          <View style={styles.termsContainer}>
            <Checkbox
              value={formData.agreeToTerms}
              onValueChange={(value) => handleChange('agreeToTerms', value)}
              color={formData.agreeToTerms ? '#f4a51c' : undefined}
              style={styles.checkbox}
            />
            <Text style={styles.termsText}>
              I agree to the <Text style={styles.termsLink}>Terms and Conditions</Text>
            </Text>
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={handleSubmit}
            disabled={!formData.agreeToTerms}
          >
            <LinearGradient
              colors={['#f4a51c', '#c822ff']}
              style={[styles.button, !formData.agreeToTerms && styles.disabledButton]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.buttonText}>Sign Up</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Already have account */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(pages)/signin')}>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </StarWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 25,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    color: '#fff',
    fontFamily: 'Lora-Bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
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
  errorBorder: {
    borderColor: '#ff6b6b',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 13,
    fontFamily: 'Lora-Regular',
    marginTop: 6,
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
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 25,
  },
  checkbox: {
    marginRight: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#aaa',
  },
  termsText: {
    color: '#ccc',
    fontFamily: 'Lora-Regular',
    fontSize: 14,
  },
  termsLink: {
    color: '#fcb900',
    textDecorationLine: 'underline',
  },
  buttonContainer: {
    marginTop: 15,
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
    fontFamily: 'Lora-Bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },
  loginText: {
    color: '#ccc',
    fontFamily: 'Lora-Regular',
  },
  loginLink: {
    color: '#fcb900',
    fontFamily: 'Lora-Bold',
    textDecorationLine: 'underline',
  },
});
