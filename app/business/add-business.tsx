import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { firestore, storage } from '@/config/FireBaseConfig'; // Ensure the path is correct
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';

import placeholderImage from '@/assets/images/placeholder.png';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '@/constants/Colors';
import { useUser } from '@clerk/clerk-expo';

const AddBusinessScreen: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [contact, setContact] = useState('');
  const [website, setWebsite] = useState('');
  const [about, setAbout] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();
const user=useUser()
  useEffect(() => {
    navigation.setOptions({
        headerShown:true,
        headerTitle:"Add Business"
      })

    const fetchCategories = async () => {
      try {
        const categoriesCollection = collection(firestore, 'Categories');
        const categoriesSnapshot = await getDocs(categoriesCollection);
        const fetchedCategories = categoriesSnapshot.docs.map(doc => doc.data().name);
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error fetching categories: ", error);
      }
    };

    fetchCategories();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri: string) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(storage, `business-app/${Date.now()}`);
    await uploadBytes(storageRef, blob);
    return await getDownloadURL(storageRef);
  };

  const handleAddBusiness = async () => {
    setLoading(true);
    try {
      let imageUrl = '';
      if (image) {
        imageUrl = await uploadImage(image);
      }

      const businessData = {
        name,
        address,
        contact,
        website,
        about,
        category,
        imageUrl: imageUrl || '',
        username:user?.user?.fullName,
        userEmail:user?.user?.primaryEmailAddress?.emailAddress,
        userImage:user?.user?.imageUrl
      };

      const businessListCollection = collection(firestore, 'BusinessList');
      await addDoc(businessListCollection, businessData);

      Alert.alert('Success', 'Business added successfully');
      navigation.goBack();
    } catch (error) {
      console.error("Error adding business: ", error);
      Alert.alert('Error', 'Failed to add business');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={pickImage}>
        <Image source={image ? { uri: image } : placeholderImage} style={styles.image} />
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
      />
      <TextInput
        style={styles.input}
        placeholder="Contact"
        value={contact}
        onChangeText={setContact}
      />
      <TextInput
        style={styles.input}
        placeholder="Website"
        value={website}
        onChangeText={setWebsite}
      />
      <TextInput
      multiline
      numberOfLines={4}
        style={styles.input}
        placeholder="About"
        value={about}
        onChangeText={setAbout}
      />
      <Picker
        selectedValue={category}
        style={styles.picker}
        onValueChange={(itemValue) => setCategory(itemValue)}
      >
        <Picker.Item label="Select Category" value="" />
        {categories.map((cat, index) => (
          <Picker.Item key={index} label={cat} value={cat} />
        ))}
      </Picker>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleAddBusiness}>
          <Text style={styles.buttonText}>Add Business</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor:Colors.PRIMARY ,
    borderRadius: 8,
    marginBottom: 10,
  },
  picker: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    marginBottom: 10,
  },
  button: {
    width: '100%',
    padding: 15,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default AddBusinessScreen;
