import { View, Text, Image, StyleSheet } from 'react-native';
import React from 'react';
import StarWrapper from '@/components/layout/AppWrapper';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

const Auth = () => {
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
        <View style={styles.buttonBox}>

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
    // fontWeight: 'bold',
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
  buttonBox: {
    
  }
});

export default Auth;
