import { View, Text, Pressable,StyleSheet } from 'react-native'
import React from 'react'
import { Image } from 'expo-image';
import { Colors } from '@/constants/Colors';
import * as WebBrowser from "expo-web-browser";
import { useOAuth } from "@clerk/clerk-expo";
import { useWarmUpBrowser } from "@/hooks/useWarmUpBrowser";

WebBrowser.maybeCompleteAuthSession();
export default function LoginScreen() {

  useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const onPress = React.useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } =
        await startOAuthFlow();

      if (createdSessionId) {
        setActive({ session: createdSessionId });
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  }, []);


  return (
    <View style={styles.container}>
    <Image source={require('@/assets/images/login.png')} style={styles.image} />
    <Text style={styles.tagline}>Welcome to Business Directory</Text>
      <Text style={styles.subtitle}>Connecting You with <Text style={{color:Colors.PRIMARY}}>Local Businesses</Text></Text>
    <View style={styles.buttonContainer}>
    <Pressable style={styles.button} onPress={onPress}>
        <Text style={styles.buttonLabel}>Signin</Text>
      </Pressable>
    </View>
  </View>
);
}

const styles = StyleSheet.create({
container: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  padding: 20,
  backgroundColor: '#fff',
},
image: {
  width: 270,
  height: 450,
  marginTop: -20,
  borderRadius: 20,
  borderWidth: 3,
  borderColor: 'black',
},
tagline: {
  fontSize: 30,
  fontWeight: 'bold',
  color: '#333',
  marginBottom: 10,
  textAlign: 'center',
  fontFamily:'outfit-bold'
  
},
subtitle: {
  fontSize: 20,
  color: 'black',
  textAlign: 'center',
  fontFamily:'outfit-medium'
},
buttonContainer: {
  position: 'absolute',
  bottom: 10,
  width: '100%',
  paddingHorizontal: 16,
},
button: {
  borderRadius: 10,
  width: '100%',
  height: 50,
  marginTop:-80,
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'row',
  backgroundColor:Colors.PRIMARY,

},
buttonLabel: {
  color: "white",
  fontSize: 24,
  fontFamily:'outfit-bold'
},
});