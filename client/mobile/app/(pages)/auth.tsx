import { View, Text, Image, StyleSheet } from 'react-native'
import React from 'react'
import StarWrapper from '@/components/layout/AppWrapper'

const Auth = () => {
  return (
    <StarWrapper>
      <View style={styles.mainBox}>
        <View style={styles.imageBox}>
          <Image source={require('../../assets/images/authPage.png')} style={styles.image} />
        </View>
      </View>
    </StarWrapper>
  )
}

const styles = StyleSheet.create({
  mainBox: {
    flex: 1
  },
  imageBox:{
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 5,
    overflow: 'hidden',
    // borderRadius: 30,
    // padding: 5,
  },
  image:{
    width: 250,
    height: 250,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#E3B430',
  }
})

export default Auth