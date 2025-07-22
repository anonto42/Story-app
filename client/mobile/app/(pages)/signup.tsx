import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
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

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
  };

  return (
    <StarWrapper>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join us to get started</Text>

          {/* Name Field */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.blurContainer}>
              <BlurView intensity={40} tint="extraLight" style={styles.blurView}>
                <TextInput
                  style={styles.input}
                  placeholder="John Doe"
                  placeholderTextColor="#fff"
                  value={formData.name}
                  onChangeText={(text) => handleChange('name', text)}
                />
              </BlurView>
            </View>
          </View>

          {/* Phone Field */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone Number</Text>
            <View style={styles.blurContainer}>
              <BlurView intensity={40} tint="extraLight" style={styles.blurView}>
                <TextInput
                  style={styles.input}
                  placeholder="+1 234 567 8900"
                  placeholderTextColor="#fff"
                  keyboardType="phone-pad"
                  value={formData.phone}
                  onChangeText={(text) => handleChange('phone', text)}
                />
              </BlurView>
            </View>
          </View>

          {/* Email Field */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.blurContainer}>
              <BlurView intensity={40} tint="extraLight" style={styles.blurView}>
                <TextInput
                  style={styles.input}
                  placeholder="example@email.com"
                  placeholderTextColor="#fff"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={formData.email}
                  onChangeText={(text) => handleChange('email', text)}
                />
              </BlurView>
            </View>
          </View>

          {/* Location Field */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Location</Text>
            <View style={styles.blurContainer}>
              <BlurView intensity={40} tint="extraLight" style={styles.blurView}>
                <TextInput
                  style={styles.input}
                  placeholder="City, Country"
                  placeholderTextColor="#fff"
                  value={formData.location}
                  onChangeText={(text) => handleChange('location', text)}
                />
              </BlurView>
            </View>
          </View>

          {/* Password Field */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.blurContainer}>
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
                  <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
                    <Ionicons 
                      name={showPassword ? 'eye-off' : 'eye'} 
                      size={20} 
                      color="#fff" 
                    />
                  </TouchableOpacity>
                </View>
              </BlurView>
            </View>
          </View>

          {/* Confirm Password Field */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.blurContainer}>
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
                  <TouchableOpacity onPress={toggleConfirmPasswordVisibility} style={styles.eyeIcon}>
                    <Ionicons 
                      name={showConfirmPassword ? 'eye-off' : 'eye'} 
                      size={20} 
                      color="#fff" 
                    />
                  </TouchableOpacity>
                </View>
              </BlurView>
            </View>
          </View>

          {/* Terms Checkbox */}
          <View style={styles.termsContainer}>
            <Checkbox
              value={formData.agreeToTerms}
              onValueChange={(value: boolean) => handleChange('agreeToTerms', value.toString())}
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
    fontFamily: "Lora-Bold",
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#ccc',
    fontFamily: "Lora-Regular",
    textAlign: 'center',
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    color: '#fff',
    marginBottom: 8,
    fontFamily: "Lora-Bold",
    fontSize: 15,
  },
  blurContainer: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  blurView: {
    padding: 2,
  },
  input: {
    // backgroundColor: 'rgba(10, 21, 71, 0.3)',
    color: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    fontFamily: "Lora-Regular",
    fontSize: 15,
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
    fontFamily: "Lora-Regular",
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
    // opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontFamily: "Lora-Bold",
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },
  loginText: {
    color: '#ccc',
    fontFamily: "Lora-Regular",
  },
  loginLink: {
    color: '#fcb900',
    fontFamily: "Lora-Bold",
    textDecorationLine: 'underline',
  },
});