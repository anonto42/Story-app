import { View, StyleSheet, Image } from 'react-native'
import React,{ useState } from 'react'
import LanguageButton from '@/components/ui/LanguageButton'
import NextButton from '@/components/ui/NextButton';
import StarWrapper from '@/components/layout/AppWrapper';
import { useRouter } from 'expo-router';

const Langouage = () => {

  const [selected, setSelected] = useState<string>();

  const router = useRouter();

  return (
    <StarWrapper>

      <View style={style.container}>

        <View style={style.chooseLanguageBox}>
          <Image 
            source={require('../assets/images/chooseLanguage.png')} 
            style={style.chooseLanguageBoxImage} 
          />
        </View>

        <View style={style.languageButtonBox}>

          <LanguageButton
            title="English"
            imageSource="eng"
            onPress={() => setSelected("eng")}
            selected={selected === "eng"}
          />

          <LanguageButton
            title="Español"
            imageSource="esp"
            onPress={() => setSelected("esp")}
            selected={selected === "esp"}
          />

          <LanguageButton
            title="Français"
            imageSource="fra"
            onPress={() => setSelected("fra")}
            selected={selected === "fra"}
          />

          <LanguageButton
            title="Deutsch"
            imageSource="ger"
            onPress={() => setSelected("ger")}
            selected={selected === "ger"}
          />
          
        </View>

        <NextButton
          title="Next"
          onPress={() => router.push('/onboading') }
        />

      </View>

    </StarWrapper>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#071B49',
  },
  chooseLanguageBox: { 
    width: 274,
    height: 268,
    gap: 11
  },
  chooseLanguageBoxImage: {
    width: 274,
    height: 268,
  },
  languageButtonBox: {
    gap: 11,
    marginTop: 24,
    marginBottom: 44,
  },
})

export default Langouage