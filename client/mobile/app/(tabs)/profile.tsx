import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import MainWrapper from '@/components/layout/MainWrapper'

const Profile = () => {
  return (
    <MainWrapper>
      <View style={styles.container}>
        <Text>profile</Text>
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

export default Profile