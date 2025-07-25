import React, { useState } from 'react';
import { Keyboard, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BlurView } from 'expo-blur';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import { TextInput } from 'react-native';

const HomeTopBar = () => {
    const [searchOpen, setSearchOpen] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');

    const handleSearchOpen = () => {
        if(!searchOpen){
            setSearchOpen(!searchOpen);
        }
    };

    const handleCloseButton = () => {
        Keyboard.dismiss();
        setSearchQuery('');
        setSearchOpen(false);
    };

    console.log(searchQuery)

  return (
    <View style={styles.container}>

        {/* Search Bar will change animation and design for more clear */}

        <BlurView intensity={30} tint="prominent" style={[
            styles.blurContainer,
            searchOpen ? styles.blurContainerOpen : styles.blurContainerClosed
            ]}>
            <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search..."
                placeholderTextColor="#ccc"
                style={styles.input}
                autoFocus
            />

            {
                searchQuery != "" ? 
                <TouchableOpacity onPress={handleCloseButton} style={styles.backButton}>
                    <EvilIcons name="close" size={34} color="#fff" />
                </TouchableOpacity> : <></>
            }
            
        </BlurView>

        <TouchableOpacity onPress={handleSearchOpen} style={styles.touchableOpacity}>
            <View style={styles.blurView}>
                <EvilIcons name="search" size={34} color="#fff" />
            </View>
        </TouchableOpacity>
    </View>
  );
};

export default HomeTopBar;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    zIndex: 100,
    elevation: 60,
  },
  blurView: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#fff',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 100,
    paddingBottom: 5,
    elevation: 60,
  },
  touchableOpacity: {
    position: 'absolute',
    top: 5,
    right: 20,
    elevation: 60,
  },
  blurContainer: {
    width: '60%',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 60,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    borderRadius: 20,
    marginVertical: "auto",
    marginHorizontal: "15%",
    borderWidth: 1,
    borderColor: '#fff'
  },
  blurContainerOpen:{
    opacity: 1,
    // transition: "opacity 0.3s ease-in-out",
  },
  blurContainerClosed:{
    opacity: 0,
    // transition: "opacity 0.3s ease-in-out",
  },
  backButton: {
    marginRight: 10,
    marginBottom: 6
  },
  input: {
    flex: 1,
    height: "100%",
    borderRadius: 20,
    paddingHorizontal: 15,
    color: '#fff',
    fontFamily: 'Lora-Regular',
    fontSize: 17,
  },
});