import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import MainWrapper from '@/components/layout/MainWrapper'

const Playlist = () => {
  return (
    <MainWrapper>
      <View style={styles.container}>
        <Text>Playlist</Text>
      </View>
    </MainWrapper>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default Playlist