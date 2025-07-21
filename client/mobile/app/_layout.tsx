import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import * as SplashScreen from 'expo-splash-screen';
import { View, Image, StyleSheet } from "react-native";
import * as Font from 'expo-font';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      // await new Promise(resolve => setTimeout(resolve, 2000));
      
      await Font.loadAsync({
        "Lora-Bold": require('../assets/fonts/Lora-Bold.ttf'),
        "Lora-Regular": require('../assets/fonts/Lora-Regular.ttf'),
        "Lora-Medium": require('../assets/fonts/Lora-Medium.ttf'),
        "Lora-Italic": require('../assets/fonts/Lora-Italic.ttf'),
      })
      
      await SplashScreen.hideAsync();
      setAppReady(true);
    };

    prepare();
  }, []);

  if (!appReady) {
    return (
      <View style={styles.splash}>
        <Image
          source={require('../assets/images/main.png')}
          style={styles.logo}
        />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: '#071B49',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 334,
    height: 334,
    resizeMode: 'contain',
    marginBottom: 40,
  },
});
