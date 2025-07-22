import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';

const { width } = Dimensions.get('window');

const slides = [
  {
    key: '1',
    title: 'Every Whisper Begins with a Guide',
    description: `her name is Ora ~ the gentle voice behind every bedtime story.But in our world of dreams, she is known as the ElderElf:a quiet guardian of sleep, guiding each child with starlight, music, and calm.
    Available in English, German, Spanish and French, her whisper speaks to the heart.`,
    image: require('../../assets/images/slider_image_1.png'),
  },
  {
    key: '2',
    title: 'Ready to Whisper?',
    description: `WhisperWings is more than an app.
        It’s a bedtime companion.
        A voice of calm.
        A bridge between language and love.
        And a safe place to rest — every single night.`,
    image: require('../../assets/images/slider_image_2.png'),
  },
  {
    key: '3',
    title: 'Every Dream Begins with a Whisper',
    description: `Our stories are gently chosen, each carrying a mood—like    kindness, courage, or quiet wonder.
        They're crafted to be joyfully luminous, feather-light, and whimsically rich, all wrapped in the voice of the ElderElf.
        So tender, a child might drift to sleep with their heart smiling.`,
    image: require('../../assets/images/slider_image_3.png'),
  },
];

export default function SliderScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<any>>(null);
  const router = useRouter();

  const onViewRef = useRef(({ viewableItems }: any) => {
    setCurrentIndex(viewableItems[0]?.index || 0);
  });

  const scrollToIndex = (index: number) => {
    flatListRef.current?.scrollToIndex({ index });
    setCurrentIndex(index);
  };

  const handleArrowPress = (direction: 'left' | 'right') => {
    if (direction === 'left' && currentIndex > 0) {
      scrollToIndex(currentIndex - 1);
    } else if (direction === 'right') {
      if (currentIndex < slides.length - 1) {
        scrollToIndex(currentIndex + 1);
      } else {
        router.push('/auth');
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = currentIndex + 1;

      if (nextIndex >= slides.length) {
        nextIndex = 0;
      }

      scrollToIndex(nextIndex);
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.topBar}>
            <TouchableOpacity onPress={() => handleArrowPress('left')}>
                <Text style={styles.arrow}>{ currentIndex == 0 ? "" : "◀"}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => handleArrowPress('right')}>
                <Text style={styles.arrow}>▶</Text>
            </TouchableOpacity>
        </View>
        <FlatList
            ref={flatListRef}
            data={slides}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.key}
            renderItem={({ item }) => (
            <View style={styles.slide}>
                {/* <Image source={item.image} style={styles.image} resizeMode="contain" /> */}
                <View style={styles.shadowWrapper}>
                  <Image source={item.image} style={styles.image} />
                </View>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
            </View>
            )}
            onViewableItemsChanged={onViewRef.current}
            viewabilityConfig={viewConfigRef.current}
        />

        <View style={styles.pagination}>
            {slides.map((_, index) => (
            <View
                key={index}
                style={[
                styles.dot,
                currentIndex === index ? styles.activeDot : null,
                ]}
            />
            ))}
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    width,
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  shadowWrapper: {
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 5,
    overflow: 'hidden',
    borderRadius: 30,
    padding: 5,
  },

  image: {
    width: 250,
    height: 250,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#E3B430',
  },
  title: {
    color: '#E3B430',
    fontSize: 18,
    marginTop: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  description: {
    color: '#faca43',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
    lineHeight: 22,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'white',
    marginHorizontal: 5,
    opacity: 0.5,
  },
  activeDot: {
    backgroundColor: 'purple',
    opacity: 1,
  },
  topBar:{
    width: "100%",
    height: 50,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: '13%',
  },
  arrow: {
    fontSize: 28,
    color: '#E3B430',
  }
});
