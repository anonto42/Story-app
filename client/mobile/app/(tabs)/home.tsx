import { Text, StyleSheet, ScrollView } from 'react-native';
import React from 'react';
import MainWrapper from '@/components/layout/MainWrapper';
import HomeTopBar from '@/components/ui/HomeTopBar';
import CartType from '@/components/screen/CartType';

const Home = () => {
  return (
    <MainWrapper>
      <HomeTopBar />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <CartType name="Children Story" />

      </ScrollView>
    </MainWrapper>
  );
};

export default Home;

const styles = StyleSheet.create({
  scrollContent: {
    paddingTop: 70, // Give space for top bar
    paddingHorizontal: 16,
  },
  text: {
    color: 'white',
    fontSize: 24,
  },
});
