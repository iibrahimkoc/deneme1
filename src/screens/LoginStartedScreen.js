import React, {useEffect} from 'react';
import {View, Text, StyleSheet, TouchableHighlight, TouchableOpacity, Image, SafeAreaView} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

const LoginStartedScreen = ({navigation}) => {
  useEffect(() => {
    const checkUserLoginStatus = () => {
      const savedEmail = storage.getString('user_email');
      console.log("email: ",savedEmail);

      const savedPassword = storage.getString('user_password');
      console.log("şifre",savedPassword);

      if (savedEmail !== undefined && savedPassword !== undefined) {
        // Kullanıcı bilgileri mevcutsa otomatik giriş yap
        navigation.reset({
          index: 0,
          routes: [{ name: 'TabNavigator', params: { screen: 'AIsScreen' } }],
        });
      }
    }
    checkUserLoginStatus();
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.containerBox1}>
        <Image
          style={styles.Image}
          source={require('../assets/images/647b9f6b097af.png')} />
      </View>
      <View style={styles.containerBox2}>
        <Text style={styles.title}>Yazılım, eğitim, psikoloji ve birçok alanda her cevap <Text style={{fontWeight:"bold"}}>AIGENCY</Text>'de</Text>
        <TouchableHighlight style={styles.loginButton}
                            onPress={() => navigation.navigate("LoginScreen")}
        ><LinearGradient colors={['rgb(184,86,196)', 'rgb(121,119,243)']}
                         start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }}
                         style={styles.buttonGradient}>
          <Text style={styles.text}>GİRİŞ</Text>
        </LinearGradient>
        </TouchableHighlight>
        <LinearGradient colors={['rgb(184,86,196)', 'rgb(121,119,243)']}
                        start={{ x: 0.25, y: 0.25 }} end={{ x: 1.0, y: 1.0 }}
                        style={styles.signupButton}>
          <TouchableOpacity style={styles.signupButtonBox}
                            onPress={() => navigation.navigate("SignupScreen")}
          >
            <Text style={styles.text}>KAYIT OL</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>

    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "rgb(12,15,22)",
  },
  containerBox1: {
    width: '100%',
    height: "30%",
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  containerBox2: {
    width: '100%',
    height: "70%",
    justifyContent: 'center',
    alignItems: 'center',
  },
  Image: {
    width: 400,
    aspectRatio: 4,
    resizeMode: 'contain',
  },
  headerTitle: {
    fontSize: 60,
    color: 'white',
  },
  title: {
    fontSize: 17,
    color: 'white',
    width: '70%',
    textAlign: 'center',
    marginVertical: 10,
  },
  text: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'Bungee-Regular',
  },
  loginButton: {
    width: "70%",
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginVertical: 25,
    marginTop: 20,
  },
  buttonGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupButton:{
    width: "70%",
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  signupButtonBox:{
    width: '98%',
    height: '85%',
    backgroundColor: "rgb(12,15,22)",
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  }
})

export default LoginStartedScreen;
