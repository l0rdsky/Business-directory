import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList, Touchable, TouchableOpacity } from 'react-native';
import { firestore } from '@/config//FireBaseConfig'; // Ensure the path is correct
import { collection, getDocs } from 'firebase/firestore';

interface Category {
  name: string;
  iconLink: string;
}

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesCollection = collection(firestore, 'Categories');
        const categoriesSnapshot = await getDocs(categoriesCollection);
        const categoriesData = categoriesSnapshot.docs.map(doc => doc.data() as Category);
        // console.log('Fetched categories data:', categoriesData);
        setCategories(categoriesData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching categories data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (categories.length === 0) {
    return <Text>No categories available</Text>;
  }

  return (
    <>
    {/* <TouchableOpacity>  */}
    <Text style={{
        fontFamily:"outfit-bold",
        fontSize:20,
        paddingLeft:20,
        color:'black',
        paddingTop:10,
        paddingBottom:13
     }}>Categories</Text>
    <FlatList
      data={categories}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <View style={styles.category}>
         <TouchableOpacity>
          <Image source={{ uri: item.iconLink }} style={styles.icon} />
          <Text style={styles.name}>{item.name}</Text>
          </TouchableOpacity>
        </View>
        
      )}
    />
    {/* </TouchableOpacity> */}
    </>
  );
};

const styles = StyleSheet.create({
  category: {
    alignItems: 'center',
    paddingLeft:15,
    paddingRight:1,
    alignContent:'center'
  },
  icon: {
    width: 55,
    height: 55,
    borderRadius: 25,
  },
  name: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: "medium",
    fontFamily:'outfit-medium',
    color: '#333',
    textAlign:'center'
  },
});

export default Categories;
