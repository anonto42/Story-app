import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { CartProps } from '@/app/types/propes'
import { BlurView } from 'expo-blur'
import { Image } from 'expo-image'
import Fontisto from '@expo/vector-icons/Fontisto'

const Card = ({data}:{ data: CartProps}) => {
    const flag = data.language === "eng" ? require('@/assets/images/eng.png') : data.language === "esp" ? require('@/assets/images/esp.png') : data.language === "fra" ? require('@/assets/images/fra.png') : require('@/assets/images/ger.png')
    
  return (
    <BlurView style={styles.container} tint="prominent" intensity={40}>
      <Image source={{ uri: data.thumbel }} style={styles.image} />
      <Text style={styles.title}>{data.title}</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.creator}>{data.creator}</Text>
        <Image source={flag} style={styles.flag} />
      </View>
      <View style={styles.infoContainer2}>
        <Fontisto name="clock" size={10} color="#fff" />
        <Text style={styles.timeFrame}>{data.timeFrame}</Text>
      </View>
      <View style={styles.infoContainer2}>
        <Fontisto name="eye" size={10} color="#fff" />
        <Text style={styles.view}>Views:</Text>
        <Text style={styles.view}>{data.view}</Text>
      </View>
    </BlurView>
  )
}

export default Card

const styles = StyleSheet.create({
    container: {
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.6)',
        elevation: 60,
        overflow: 'hidden',
        height: "auto",
        width: 175,
        gap: 2
    },
    image: {
        width: '100%',
        height: 160,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.6)',
    },
    title:{
        fontSize: 14,
        fontFamily: 'Lora-Bold',
        color: '#fff',
    },
    infoContainer:{
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    infoContainer2:{
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 5, 
    },
    creator:{
        fontSize: 12,
        fontFamily: 'Lora-Regular',
        color: '#fff',
    },
    flag:{
        width: 20,
        height: 20,
    },
    timeFrame:{
        fontSize: 12,
        fontFamily: 'Lora-Regular',
        color: '#fff',
    },
    view:{
        fontSize: 12,
        fontFamily: 'Lora-Regular',
        color: '#fff',
    }
})