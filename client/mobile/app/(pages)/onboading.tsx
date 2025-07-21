import { View, Text, StyleSheet, FlatList } from 'react-native'
import React from 'react'
import StarWrapper from '@/components/layout/AppWrapper'
import SliderScreen from '@/components/screen/SliderScreen'

const OnBoading = () => {

  return (
    <StarWrapper>
      <View style={styles.container}>
        <SliderScreen />
      </View>
    </StarWrapper>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

export default OnBoading