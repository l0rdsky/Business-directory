import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Image, Pressable } from 'react-native';
import { firestore } from '@/config/FireBaseConfig'; // Ensure the path is correct
import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { useUser } from "@clerk/clerk-expo";
import { useNavigation } from 'expo-router';

interface Business {
  id: string;
  name: string;
  address: string;
  contact: string;
  imageUrl: string;
  website: string;
  about: string;
  category: string;
}

const MyBusinessScreen: React.FC = () => {
  const { user } = useUser();
  const navigation = useNavigation();
  const userEmail = user?.primaryEmailAddress?.emailAddress ?? '';
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigation.setOptions({
        headerShown:true,
        headerTitle:"My Business"
      })
    const fetchBusinesses = async () => {
      try {
        const businessCollection = collection(firestore, 'BusinessList');
        const q = query(businessCollection, where('userEmail', '==', userEmail));
        const querySnapshot = await getDocs(q);
        const fetchedBusinesses = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Business[];
        setBusinesses(fetchedBusinesses);
      } catch (error) {
        console.error("Error fetching businesses: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, [userEmail]);

  const handleDeleteBusiness = async (id: string) => {
    Alert.alert(
      'Delete Business',
      'Are you sure you want to delete this business?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            try {
              await deleteDoc(doc(firestore, 'BusinessList', id));
              setBusinesses(prev => prev.filter(business => business.id !== id));
              Alert.alert('Success', 'Business deleted successfully');
            } catch (error) {
              console.error("Error deleting business: ", error);
              Alert.alert('Error', 'Failed to delete business');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderBusiness = ({ item }: { item: Business }) => (
    <View style={styles.businessCard}>
      <Image source={{ uri: item.imageUrl }} style={styles.businessImage} />
      <View style={styles.businessInfo}>
        <Text style={styles.businessName}>{item.name}</Text>
        <Text style={styles.businessDetails}>{item.address}</Text>
        <Text style={styles.businessDetails}>{item.contact}</Text>
        <Text style={styles.businessDetails}>{item.website}</Text>
        <Text style={styles.businessDetails}>{item.about}</Text>
        <Text style={styles.businessDetails}>{item.category}</Text>
        <Pressable
          style={styles.deleteButton}
          onPress={() => handleDeleteBusiness(item.id)}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </Pressable>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (businesses.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text>No businesses found</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={businesses}
      keyExtractor={item => item.id}
      renderItem={renderBusiness}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 20,
  },
  businessCard: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 20,
    borderRadius: 10,
    elevation: 5,
  },
  businessImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  businessInfo: {
    alignItems: 'flex-start',
  },
  businessName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  businessDetails: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 4,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 10,
    width:"100%",
    alignItems: 'center',
    marginTop: 10,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default MyBusinessScreen;
