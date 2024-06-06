
// import { getFirestore, collection, addDoc } from "firebase/firestore";

// const db = getFirestore();

// const businessList = [
//   {
//     name: "Tech World",
//     address: "123 Tech Lane, Silicon Valley, CA",
//     category: "Electronics",
//     contact: "+1 800 123 4567",
//     imageUrl: "https://example.com/images/tech-world.jpg",
//     website: "https://techworld.com",
//     about: "Tech World offers the latest in consumer electronics, from cutting-edge smartphones to high-performance laptops."
//   },
//   {
//     name: "Healthy Grocery",
//     address: "456 Green St, Portland, OR",
//     category: "Grocery",
//     contact: "+1 800 234 5678",
//     imageUrl: "https://example.com/images/healthy-grocery.jpg",
//     website: "https://healthygrocery.com",
//     about: "Healthy Grocery is your one-stop shop for organic and fresh produce, dairy, and grocery items."
//   },
//   {
//     name: "Fashion Hub",
//     address: "789 Style Ave, New York, NY",
//     category: "Fashion",
//     contact: "+1 800 345 6789",
//     imageUrl: "https://example.com/images/fashion-hub.jpg",
//     website: "https://fashionhub.com",
//     about: "Fashion Hub brings you the latest trends in clothing, shoes, and accessories for all seasons."
//   },
//   {
//     name: "Book Nook",
//     address: "101 Library Lane, Boston, MA",
//     category: "Books",
//     contact: "+1 800 456 7890",
//     imageUrl: "https://example.com/images/book-nook.jpg",
//     website: "https://booknook.com",
//     about: "Book Nook offers a wide range of books from various genres, perfect for book lovers of all ages."
//   },
//   {
//     name: "Fit Life Gym",
//     address: "202 Muscle St, Los Angeles, CA",
//     category: "Fitness",
//     contact: "+1 800 567 8901",
//     imageUrl: "https://example.com/images/fit-life-gym.jpg",
//     website: "https://fitlifegym.com",
//     about: "Fit Life Gym provides state-of-the-art fitness equipment, personal training, and group exercise classes."
//   },
//   {
//     name: "MediCare Pharmacy",
//     address: "303 Health Blvd, Miami, FL",
//     category: "Medical",
//     contact: "+1 800 678 9012",
//     imageUrl: "https://example.com/images/medicare-pharmacy.jpg",
//     website: "https://medicarepharmacy.com",
//     about: "MediCare Pharmacy offers a full range of prescription and over-the-counter medications, as well as health consultations."
//   },
//   {
//     name: "ShopEase",
//     address: "404 Commerce Rd, Chicago, IL",
//     category: "Shopping",
//     contact: "+1 800 789 0123",
//     imageUrl: "https://example.com/images/shopease.jpg",
//     website: "https://shopease.com",
//     about: "ShopEase provides a wide variety of products, from home goods to electronics, at competitive prices."
//   }
// ];

// businessList.forEach(async (business) => {
//   try {
//     await addDoc(collection(db, "BusinessList"), business);
//     console.log("Document successfully written!");
//   } catch (e) {
//     console.error("Error adding document: ", e);
//   }
// });

import { Colors } from '@/constants/Colors';
import React from 'react';
import { View, Text, Image, StyleSheet, FlatList } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface Business {
  name: string;
  category: string;
  imageUrl: string;
}

interface PopularBusinessCardProps {
  business: Business;
}

const PopularBusinessCard: React.FC<PopularBusinessCardProps> = ({ business }) => {
  const randomRating = (Math.random() * 4 + 2).toFixed(1); // Generates a random rating between 1 and 5

  return (
    <View style={styles.card}>
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
    </View>
  );
};
const popularBusinesses: Business[] = [
  {
    name: "World Tech",
    category: "Electronics",
    imageUrl: "https://static.vecteezy.com/system/resources/thumbnails/010/840/577/small/world-tech-logo-design-premium-vector.jpg",
  },
  {
    name: "Healthy Grocery",
    category: "Grocery",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTA4zXqG4CbXBHvwPRkEIzknH5sGZha2Pr8tQ&s",
  },
  {
    name: "Fashion Hub",
    category: "Fashion",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSu-OF_dYX2QW2HZaKBwCmjuZ0suu6q_XTBMw&s",
  },
  {
    name: "Book Nook",
    category: "Books",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBT8p86_O9WgvVC-Ka-V6Uaz2M6Qo_FaBinw&s",
  },
];

const PopularBusinessSection: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Popular Businesses</Text>
      <FlatList
        data={popularBusinesses}
        renderItem={({ item }) => <PopularBusinessCard business={item} />}
        keyExtractor={(item) => item.name}
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
    marginLeft:12,
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
    borderRadius:30,
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
    fontFamily:'outfit-medium',
    backgroundColor:Colors.PRIMARY,
    borderRadius:5,
    padding:2,
    paddingHorizontal:7
  },
  container: {
    marginVertical: 7,
  },
  heading: {
    fontSize: 20,
    marginHorizontal: 15,
    fontFamily:'outfit-bold'
  },
});

export default PopularBusinessSection;