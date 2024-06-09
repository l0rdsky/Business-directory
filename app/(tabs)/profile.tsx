import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Share } from 'react-native';
import { useAuth, useUser } from "@clerk/clerk-expo";
import addIcon from '@/assets/images/add.png';
import businessIcon from '@/assets/images/business-and-trade.png';
import shareIcon from '@/assets/images/share.png';
import logoutIcon from '@/assets/images/logout.png';
import { useRouter } from 'expo-router';

const ProfileScreen: React.FC = () => {
  const router = useRouter();
  const { user } = useUser();
  const {signOut} = useAuth();
  const firstName = user?.firstName ?? 'Unknown';
  const lastName = user?.lastName ?? 'Unknown';
  const email = user?.primaryEmailAddress?.emailAddress ?? 'Unknown';
  const imageUrl = user?.imageUrl ?? ''; 
  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image source={{ uri: imageUrl }} style={styles.profileImage} />
        <Text style={styles.userName}>{firstName} {lastName}</Text>
        <Text style={styles.email}>{email}</Text>
      </View>
      
      <View style={styles.optionsContainer}>
        <View style={styles.row}>
          <TouchableOpacity style={styles.option} onPress={() => router.push('/business/add-business')}>
            <Image source={addIcon} style={styles.optionIcon} />
            <Text>Add Business</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option} onPress={() => router.push('/business/my-business')}>
            <Image source={businessIcon} style={styles.optionIcon} />
            <Text>My Business</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity style={styles.option} onPress={() => Share.share({
            message:"Download Business-Directory app"
          })}>
            <Image source={shareIcon} style={styles.optionIcon} />
            <Text>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option} onPress={() => signOut()}>
            <Image source={logoutIcon} style={styles.optionIcon} />
            <Text>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.footerText}>Developed by Akash @2024</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  email: {
    fontSize: 18,
    color: 'gray',
    marginBottom: 20,
  },
  optionsContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 40,
    
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  option: {
    alignItems: 'center',
    borderRadius: 15,
    backgroundColor: 'white',
    elevation: 3,
    paddingHorizontal: 10,
    paddingVertical: 5,
    width: '50%',
    margin:10, // Adjust as needed
  },
  optionIcon: {
    width: 40,
    height: 40,
    marginBottom: 5,
  },
  footerText: {
    color: 'gray',
    fontSize: 16,
  },
});

export default ProfileScreen;
