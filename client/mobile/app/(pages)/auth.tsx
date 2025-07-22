import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import StarWrapper from '@/components/layout/AppWrapper';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { useRouter } from 'expo-router';

const Auth = () => {
  const router = useRouter();  

  const handleLogin = () => {
    router.push('/(pages)/signin');
  };

  const handleSignUp = () => {
    router.push('/(pages)/signup');
  };
  
  return (
    <StarWrapper>
      <View style={styles.mainBox}>

        {/* Image */}
        <View style={styles.imageBox}>
          <Image source={require('../../assets/images/authPage.png')} style={styles.image} />
        </View>

        {/* Gradient Text */}
        <MaskedView
          maskElement={
            <Text style={[styles.gradientText,{fontFamily:"Lora-Bold"}]}>
              Your journey begins here.
            </Text>
          }
        >
          <LinearGradient
            colors={['#A10BFF', '#FCF8FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            {/* Text content must match mask text */}
            <Text style={[styles.gradientText,{fontFamily:"Lora-Bold"}, { opacity: 0 }]}>
              Your journey begins here.
            </Text>
          </LinearGradient>
        </MaskedView>

        {/* Normal Text */}
        <Text style={styles.innerText}>
          Create your WhisperWings account to unlock your first stories, choose your dream moods, and meet your guiding whispers. The ElderElf is waiting for you beneath the Feather Star.
        </Text>

        {/* Button */}
        <View style={styles.container}>
      
          {/* Solid Gradient Button */}
          <TouchableOpacity style={styles.buttonWrapper}>
            <LinearGradient
              colors={['#d69c4a', '#bd6396', '#a020f0']} // 3-color gradient
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientButton}
            >
              <Text style={styles.buttonText} onPress={handleSignUp}>Sign Up</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Gradient Border Button */}
          <LinearGradient
            colors={['#d69c4a', '#bd6396', '#a020f0']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.borderWrapper}
          >
            <TouchableOpacity style={styles.borderButton} onPress={handleLogin}>
              <Text style={styles.buttonText2}>Login</Text>
            </TouchableOpacity>
          </LinearGradient>
          
        </View>

      </View>
    </StarWrapper>
  );
};

const styles = StyleSheet.create({
  mainBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 20,
  },
  imageBox: {
    width: 260,
    height: 260,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 8,
    overflow: 'hidden',
    borderRadius: 30,
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#E3B430',
  },
  gradientText: {
    fontSize: 28,
    textAlign: 'center',
    width: 300,
  },
  innerText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    fontFamily: "Lora-Regular",
    lineHeight: 24,
  },
  container: {
    padding: 10,
    gap: 10,
    flexDirection: 'row'
  },
  buttonWrapper: {
    width: 150,
    height: 50,
    borderRadius: 30,
    overflow: 'hidden',
  },
  gradientButton: {
    flex: 1,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  buttonText2: {
    color: '#000',
    fontWeight: '600',
    fontSize: 16,
  },
  borderWrapper: {
    width: 150,
    height: 50,
    overflow: 'hidden',
    borderRadius: 30,
    padding: 2,
  },
  borderButton: {
    backgroundColor: "#c5adf7",
    borderRadius: 26,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignItems: "center",
  },
});

export default Auth;
