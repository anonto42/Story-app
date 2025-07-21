import React from 'react';
import { TouchableOpacity, Text, Image, StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';

const images = {
  esp: require('../../assets/images/esp.png'),
  eng: require('../../assets/images/eng.png'),
  fra: require('../../assets/images/fra.png'),
  ger: require('../../assets/images/ger.png'),
};

export default function LanguageButton({
  title,
  imageSource,
  onPress,
  selected = false,
}: {
  title: string;
  imageSource: keyof typeof images;
  onPress: () => void;
  selected?: boolean;
}) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.wrapper}>
      {selected ? (
        <BlurView
          intensity={30}
          tint="light"
          style={[
            {
              borderWidth: selected ? 0 : 3,
            },
            styles.blurContainer,
          ]}
        >
          <Content title={title} image={imageSource === "eng" ? images.eng : imageSource === "esp" ? images.esp : imageSource === "fra" ? images.fra : imageSource === "ger" ? images.ger : images.eng} />
        </BlurView>
      ) : (
        <View style={[styles.button]}>
          <Content title={title} image={imageSource === "eng" ? images.eng : imageSource === "esp" ? images.esp : imageSource === "fra" ? images.fra : imageSource === "ger" ? images.ger : images.eng} />
        </View>
      )}
    </TouchableOpacity>
  );
}

const Content = ({ title, image }: { title: string; image: any }) => (
  <>
    <Text style={styles.text}>{title}</Text>
    <Image source={image} style={styles.flag} />
  </>
);

const styles = StyleSheet.create({
  wrapper: {
    width: 335,
    height: 50,
    borderRadius: 12,
    overflow: 'hidden',
  },
  blurContainer: {
    flex: 1,
    borderRadius: 12,
    borderColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  button: {
    flex: 1,
    borderRadius: 12,
    borderColor: '#ffffff50',
    borderWidth: 3,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  text: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '600',
    fontFamily: 'Lora-Bold',
    marginRight: 4,
  },
  flag: {
    width: 50,
    height: 40,
    resizeMode: 'contain',
  },
});
