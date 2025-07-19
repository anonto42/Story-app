import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const langouage = () => {
  return (
    <View style={style.container}>
      <Text>langouage</Text>
    </View>
  )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#071B49',
    },
})

export default langouage