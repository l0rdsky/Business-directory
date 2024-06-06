import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, FlatList, ScrollView, ActivityIndicator, ToastAndroid } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { firestore } from '@/config/FireBaseConfig'; // Ensure the path is correct
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors } from '@/constants/Colors';
import { useUser } from '@clerk/clerk-expo';

interface Business {
  id: string;
  name: string;
  address: string;
  category: string;
  contact: string;
  imageUrl: string;
  website: string;
  about: string;
  reviews?: Review[];
}

interface Review {
  rating: number;
  comment: string;
  userName: string;
  userProfilePhoto: string;
}

const BusinessDetailsScreen: React.FC = () => {
  const { businessid } = useLocalSearchParams<{ businessid: string }>();
  const { user } = useUser();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  useEffect(() => {
    const fetchBusinessDetails = async () => {
      try {
        if (businessid) { // Check if businessid is defined
          const businessDoc = await getDoc(doc(firestore, 'BusinessList', businessid));
          if (businessDoc.exists()) {
            setBusiness(businessDoc.data() as Business);
          } 
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching business details: ", error);
        setLoading(false);
      }
    };

    fetchBusinessDetails();
  }, [businessid]);

  const handleAddReview = async () => {
    if (rating >= 0 && comment && user && businessid) {
      try {
        const { firstName, lastName, imageUrl } = user;
        const userName = `${firstName} ${lastName}`;
        const userProfilePhoto = imageUrl;

        const businessRef = doc(firestore, 'BusinessList', businessid);
        await updateDoc(businessRef, {
          reviews: arrayUnion({ rating, comment, userName, userProfilePhoto }),
        });
        ToastAndroid.show('Comment added Successfully',ToastAndroid.BOTTOM)
        setBusiness(prev => prev ? { ...prev, reviews: [...(prev.reviews || []), { rating, comment, userName, userProfilePhoto }] } : null);
        setRating(0);
        setComment('');
      } catch (error) {
        console.error("Error adding review: ", error);
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!business) {
    return <Text>Business not found</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: business.imageUrl }} style={styles.image} />
      <View style={styles.detailsContainer}>
        <Text style={styles.name}>{business.name}</Text>
        <Text style={styles.address}>{business.address}</Text>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button}>
            <Ionicons name="call" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Ionicons name="location" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Ionicons name="globe" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Ionicons name="share-social" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <Text style={styles.about}>{business.about}</Text>
        <Text style={styles.reviewHeading}>Leave a Review</Text>
        <View style={styles.reviewContainer}>
          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map(star => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <Ionicons name="star" size={24} color={star <= rating ? "gold" : "gray"} />
              </TouchableOpacity>
            ))}
          </View>
          <TextInput
            style={styles.commentBox}
            placeholder="Write your review..."
            value={comment}
            onChangeText={setComment}
          />
          <TouchableOpacity style={styles.submitButton} onPress={handleAddReview}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.reviewHeading}>Reviews</Text>
        {business.reviews && business.reviews.length > 0 ? (
          <FlatList
            data={business.reviews}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.reviewCard}>
                <View style={styles.userInfo}>
                  <Image source={{ uri: item.userProfilePhoto }} style={styles.userImage} />
                  <Text style={{
                    fontSize:20,
                    fontFamily:'outfit',
                    paddingLeft:2,
                  }}>{item.userName}</Text>
                  
                </View>
                <View style={styles.stars}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <Ionicons key={star} name="star" size={20} color={star <= item.rating ? "gold" : "gray"} />
                  ))}
                </View>
                <Text style={{
                    fontSize:18,
                    fontFamily:'outfit',
                    paddingLeft:2,
                  }} >{item.comment}</Text>
              </View>
            )}
          />
        ) : (
          <Text>No reviews yet</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: 200,
  },
  detailsContainer: {
    padding: 16,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
  },
  name: {
    fontSize: 24,
    fontFamily: 'outfit-bold'
  },
  address: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 16,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  button: {
    backgroundColor: 'white',
    padding: 12,
    borderWidth: 1,
    elevation: 8,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
  },
  about: {
    fontSize: 16,
    marginBottom: 16,
    fontFamily: 'outfit'
  },
  reviewHeading: {
    fontSize: 20,
    fontFamily: 'outfit-bold',
    marginTop: 16,
    marginBottom: 8,
  },
  reviewContainer: {
    marginBottom: 16,
  },
  stars: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  commentBox: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    height: 80,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: Colors.PRIMARY,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'outfit-medium'
  },
  reviewCard: {
    paddingVertical: 8,

  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingBottom:5
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BusinessDetailsScreen;