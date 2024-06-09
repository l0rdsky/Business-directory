import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { collection, getDocs } from "firebase/firestore";
import { firestore } from '@/config/FireBaseConfig'; // Ensure you have the correct path to your firebase config
import { Colors } from '@/constants/Colors';
import { router, useRouter } from 'expo-router';

interface Business {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
}

interface PopularBusinessCardProps {
  business: Business;
}

const PopularBusinessCard: React.FC<PopularBusinessCardProps> = ({ business }) => {
  const randomRating = (Math.random() * 4 + 2).toFixed(1); // Generates a random rating between 2 and 6
  const router=useRouter();

  const handlePress = (id: string) => {
    router.push('/businessDetails/'+id)
  };

  return (
    <TouchableOpacity style={styles.card} onPress={()=>handlePress(business.id)}>
      <Image source={{ uri: business.imageUrl }} style={styles.image} />
      <View style={styles.cardContent}>
        <Text style={styles.name}>{business.name}</Text>
        <View style={styles.details}>
          <View style={styles.stars}>
            <Ionicons name="star" size={16} color="gold" />
            <Text style={styles.rating}>{randomRating}</Text>
          </View>
          <Text style={styles.category}>{business.category}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const PopularBusinessSection: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, "BusinessList"));
        const fetchedBusinesses: Business[] = [];
        querySnapshot.forEach((doc) => {
          fetchedBusinesses.push({ id: doc.id, ...doc.data() } as Business);
        });
        setBusinesses(fetchedBusinesses);
      } catch (error: unknown) {
        if (error instanceof Error) {
          Alert.alert("Error fetching businesses", error.message);
        } else {
          Alert.alert("Error fetching businesses", "An unknown error occurred");
        }
      }
         finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Popular Businesses</Text>
      <FlatList
        data={businesses}
        renderItem={({ item }) => <PopularBusinessCard business={item} />}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 200,
    margin: 10,
    marginLeft: 12,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 100,
  },
  cardContent: {
    padding: 10,
    borderRadius: 30,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  rating: {
    marginLeft: 5,
    fontSize: 14,
    color: 'black',
  },
  category: {
    fontSize: 14,
    color: 'white',
    fontFamily: 'outfit-medium',
    backgroundColor: Colors.PRIMARY,
    borderRadius: 5,
    padding: 2,
    paddingHorizontal: 7,
  },
  container: {
    marginVertical: 7,
  },
  heading: {
    fontSize: 20,
    marginHorizontal: 15,
    fontFamily: 'outfit-bold',
  },
});

export default PopularBusinessSection;
