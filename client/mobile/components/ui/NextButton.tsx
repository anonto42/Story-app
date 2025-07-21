import React from 'react';
import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

type NextButtonProps = {
  onPress: (event: GestureResponderEvent) => void;
  title?: string;
  disabled?: boolean;
};

export default function NextButton({ onPress, title = 'Next', disabled = false }: NextButtonProps) {
  return (
    <TouchableOpacity
      style={styles.touchable}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={['#d8a043', '#bb5e9c', '#a021f0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.gradient, disabled && styles.disabledGradient]}
      >
        <Text style={[styles.text, disabled && styles.disabledText]}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  touchable: {
    width: 335,
    height: 50,
    borderRadius: 12,
    overflow: 'hidden'
  },
  gradient: {
    flex: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledGradient: {
    opacity: 0.6,
  },
  text: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Lora-Bold',
  },
  disabledText: {
    color: '#eee',
  },
});
