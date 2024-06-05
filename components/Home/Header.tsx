import React from 'react';
import { View, Text, TextInput, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useUser } from "@clerk/clerk-expo";
import { Colors } from '@/constants/Colors';


const Header = () => {
    const {user}=useUser()
  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image 
          source={{uri:user?.imageUrl}} 
          style={styles.profileLogo} 
        />
        <Text style={styles.appName}>{user?.firstName}</Text>
      </View>
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput 
          style={styles.searchInput} 
          placeholder="Search for businesses..." 
          placeholderTextColor="#999"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: Colors.PRIMARY,
    height:200,
    borderBottomRightRadius:30,
    borderBottomLeftRadius:30
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginTop:30
  },
  profileLogo: {
    width: 50,
    height: 50,
    borderRadius: 30,
    marginRight: 16,
  },
  appName: {
    fontSize: 24,
    fontFamily: 'outfit-bold',
    color: 'white',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginTop:5,
    paddingHorizontal: 8,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#333',
  },
});

export default Header;
