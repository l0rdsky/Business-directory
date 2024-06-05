import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList } from 'react-native';
import { firestore } from '@/config/FireBaseConfig'; // Ensure the path is correct
import { collection, getDocs,query } from 'firebase/firestore';


interface Slide {
    name: string;
    imageurl: string;
  }
  
  const Slider = () => {
    const [slides, setSlides] = useState<Slide[]>([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const sliderCollection = query(collection(firestore, 'slider'));
          const sliderSnapshot = await getDocs(sliderCollection);
          const sliderData = sliderSnapshot.docs.map(doc => doc.data() as Slide);
        //   console.log('Slider data:', sliderData); // Log data to verify
          setSlides(sliderData);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching slider data: ", error);
          setLoading(false);
        }
      };
  
      fetchData();
    }, []);
  
    if (loading) {
      return <Text>Loading...</Text>;
    }
  
    if (slides.length === 0) {
      return <Text>No slides available</Text>; // Display message if no slides
    }
  
    return (
        <>
         <Text style={{
            fontFamily:"outfit-bold",
            fontSize:25,
            paddingLeft:20,
            color:'black',
            paddingTop:10,
         }}>Businesses Near You</Text>
      <FlatList
        data={slides}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Image source={{ uri: item.imageurl }} style={styles.image} />
            <Text style={styles.name}>{item.name}</Text>
          </View>
        )}
      />
      </>
    );
  };
  
  const styles = StyleSheet.create({
    slide: {
      alignItems: 'center',
      marginRight: 1,
      marginTop:5,
      paddingLeft:15
    },
    image: {
      width: 200,
      height: 120,
      borderRadius: 10,
    },
    name: {
      marginTop: 8,
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
    },
  });
  
  export default Slider;