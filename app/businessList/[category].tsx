// app/businessList/[category].tsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams, useNavigation } from 'expo-router';
import { firestore } from '@/config/FireBaseConfig'; // Ensure the path is correct
import { collection, query, where, getDocs } from 'firebase/firestore';

interface Business {
  id: string;
  name: string;
  address: string;
  category: string;
  contact: string;
  imageUrl: string;
  website: string;
  about: string;
}

const CategoryScreen: React.FC = () => {
  const { category } = useLocalSearchParams<{ category: string }>();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
const navigation=useNavigation()
  const fetchBusinesses = async () => {
    try {
      const q = query(collection(firestore, 'BusinessList'), where('category', '==', category));
      const querySnapshot = await getDocs(q);
      const fetchedBusinesses = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Business));
      setBusinesses(fetchedBusinesses);
      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.error("Error fetching businesses: ", error);
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerShown:true,
      headerTitle:category
    })
    if (category) {
      fetchBusinesses();
    }
  }, [category]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchBusinesses();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (businesses.length === 0) {
    return <Text>No businesses available</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{category}</Text>
      <FlatList
        data={businesses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (       
            <View style={styles.card}>
              <TouchableOpacity onPress={() => router.push('/businessDetails/'+item.id)}>
              <Image source={{ uri: item.imageUrl }} style={styles.image} />
              <Text style={styles.name}>{item.name}
              </Text>
              <Text style={styles.address}>{item.address}</Text>
              </TouchableOpacity>
            </View>    
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  address: {
    fontSize: 14,
    color: 'gray',
  },
});

export default CategoryScreen;










