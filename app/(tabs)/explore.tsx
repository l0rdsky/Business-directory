import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Image } from 'react-native';
import { firestore } from '@/config/FireBaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';

interface Category {
  name: string;
  iconLink: string;
}

interface Business {
  id: string;
  name: string;
  imageUrl: string;
  about: string;
}

const Explore = () => {
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [searchResults, setSearchResults] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesCollection = collection(firestore, 'Categories');
        const categoriesSnapshot = await getDocs(categoriesCollection);
        const categoriesData = categoriesSnapshot.docs.map(doc => doc.data() as Category);
        setCategories(categoriesData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching categories data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchBusinesses = async (category: string) => {
    try {
      const businessesCollection = collection(firestore, 'BusinessList');
      const q = query(businessesCollection, where('category', '==', category));
      const businessesSnapshot = await getDocs(q);
      const businessesData = businessesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Business));
      setBusinesses(businessesData);
      setSearchResults([]); // Clear search results when a category is selected
    } catch (error) {
      console.error("Error fetching businesses data:", error);
    }
  };

  const fetchSearchResults = async (searchQuery: string) => {
    try {
      const businessesCollection = collection(firestore, 'BusinessList');
      const q = query(businessesCollection, where('name', '>=', searchQuery), where('name', '<=', searchQuery + '\uf8ff'));
      const businessesSnapshot = await getDocs(q);
      const searchResultsData = businessesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Business));
      setSearchResults(searchResultsData);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const handleCategoryPress = (category: string) => {
    fetchBusinesses(category);
  };

  const handleSearchChange = (text: string) => {
    setSearch(text);
    if (text.trim().length > 0) {
      fetchSearchResults(text);
    } else {
      setSearchResults([]);
    }
  };

  const renderCategory = ({ item }) => (
    <View style={styles.category}>
      <TouchableOpacity onPress={() => handleCategoryPress(item.name)}>
        <Image source={{ uri: item.iconLink }} style={styles.icon} />
        <Text style={styles.name}>{item.name}</Text>
      </TouchableOpacity>
    </View>
  );

  const renderBusiness = ({ item }) => (
    <TouchableOpacity onPress={() => router.push('/businessDetails/'+item.id)}>
    <View style={styles.businessCard}>
     
      <Image source={{ uri: item.imageUrl }} style={styles.businessImage} />
      <View style={styles.businessInfo}>
        <Text style={styles.businessName}>{item.name}</Text>
        <Text style={styles.businessAbout}>{item.about}</Text>
      </View>
    </View>
    </TouchableOpacity>
  );

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (categories.length === 0) {
    return <Text>No categories available</Text>;
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search..."
        value={search}
        onChangeText={handleSearchChange}
      />
      <FlatList
        data={search.trim().length > 0 ? searchResults : businesses}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <>
            <Text style={styles.categoriesTitle}>Categories</Text>
            <FlatList
              data={categories}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderCategory}
              contentContainerStyle={styles.categoriesList}
            />
          </>
        }
        renderItem={renderBusiness}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 25,
  },
  searchInput: {
    height: 50,
    borderColor: Colors.PRIMARY,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    marginTop: 25,
  },
  categoriesTitle: {
    fontFamily: "outfit-bold",
    fontSize: 20,
    paddingLeft: 20,
    color: 'black',
    paddingTop: 10,
    paddingBottom: 13,
  },
  categoriesList: {
    paddingBottom: 20, // Add some space between categories and business cards
  },
  category: {
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 1,
    alignContent: 'center',
  },
  icon: {
    width: 55,
    height: 55,
    borderRadius: 25,
  },
  name: {
    marginTop: 8,
    fontSize: 13,
    fontFamily: 'outfit-medium',
    color: '#333',
    textAlign: 'center',
  },
  businessCard: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  businessImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  businessInfo: {
    marginLeft: 15,
    flex: 1,
  },
  businessName: {
    fontFamily: 'outfit-bold',
    fontSize: 16,
    color: '#333',
  },
  businessAbout: {
    fontFamily: 'outfit',
    fontSize: 14,
    color: '#666',
  },
});

export default Explore;
