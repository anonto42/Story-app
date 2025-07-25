import React, { ReactNode } from 'react';
import { ImageBackground, StyleSheet, View, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type AppWrapperProps = {
  children: ReactNode;
};

export default function MainWrapper({ children }: AppWrapperProps) {
  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent={true}
      />

      <ImageBackground
        source={require('../../assets/images/homeBackground.png')}
        style={styles.background}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.darkOverlay} />
          <View style={styles.overlay}>
            {children}
          </View>
        </SafeAreaView>
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 1,
  },
  overlay: {
    flex: 1,
    zIndex: 2,
  },
});
