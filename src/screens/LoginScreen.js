import React, { useState } from 'react';
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  Alert,
  Linking,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView, TouchableNativeFeedback, Keyboard, Platform,
} from 'react-native';
import { MMKV } from 'react-native-mmkv';
import LinearGradient from 'react-native-linear-gradient';

const storage = new MMKV();

const LoginScreen = ({ navigation, route }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setIsLogined } = route.params;

  const [secureTextEntryBox, setSecureTextEntryBox] = useState(true);
  const [imageHideOrView, setImageHideOrView] = useState(require("../assets/images/hidePassword.png"));

  const togglePasswordVisibility = () => {
    setSecureTextEntryBox(!secureTextEntryBox);
    setImageHideOrView(
      secureTextEntryBox
        ? require('../assets/images/viewPassword.png')
        : require('../assets/images/hidePassword.png')
    );
  };

  const validateEmail = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Geçersiz Email', 'Lütfen geçerli bir mail adresi giriniz.');
      return;
    }

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    try {
      const response = await fetch('https://aigency.dev/api/v1/login/', {
        method: 'POST',
        headers: {},
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.status) {
        storage.set('user_email', email);
        storage.set('user_password', password);
        storage.set('isLogined', true);

        setIsLogined(true);
        const token = data.access_token;
        storage.set('token', token);
        navigation.reset({
          index: 0,
          routes: [{ name: 'TabNavigator', params: { screen: 'AIsScreen' } }],
        });
      } else {
        const errorMessage = data.message || 'Kullanıcı bulunamadı';
        Alert.alert(errorMessage, 'Hatalı e-posta veya şifre girildi.');
      }
    } catch (error) {
      Alert.alert('Hata', 'Bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };
  const linkingUrl = () => {
    const url = "https://aigency.dev/reset-password"
    Linking.openURL(url).catch(error => {console.log("hata: ",error)});
  };

  return (
    <TouchableNativeFeedback onPress={() => Keyboard.dismiss}>
      <KeyboardAvoidingView style={{flex:1}}
                            behavior={Platform.OS === 'ios' ? "padding" : "height"}
      >
        <View style={styles.container}>
          <LinearGradient colors={['rgb(184,86,196)', 'rgb(121,119,243)']}
                          start={{ x: 0.25, y: 0.25 }} end={{ x: 1.0, y: 1.0 }}
                          style={styles.tabBars}>
            <View style={styles.containerBox1}>
              <Text style={styles.headerText}>Giriş</Text>
            </View>
          </LinearGradient>

          <View style={styles.containerBox2}>
            <View style={styles.containerBox}>
              <View style={styles.inputBox}>
                <Image source={require('../assets/images/mail.png')} style={{width: 30,height: 30,position:"absolute", zIndex: 1,top: 10,left: 10}}/>
                <TextInput
                  placeholder={'E-mail'}
                  value={email}
                  keyboardType={"email-address"}
                  onChangeText={(text) => setEmail(text)}
                  style={styles.input}
                  autoCapitalize="none" //ilk harf küçük
                />
              </View>
              <View style={styles.inputBox}>
                <Image source={require('../assets/images/password.png')} style={{width: 30,height: 30,position:"absolute", zIndex: 1,top: 10,left: 10}}/>
                <TextInput
                  placeholder={'Şifre'}
                  style={[styles.input, styles.passwordBox]}
                  onChangeText={(text) => setPassword(text)}
                  secureTextEntry={secureTextEntryBox}
                  autoCapitalize="none"
                />
                <TouchableOpacity style={{width: 30,height: 30,position:"absolute", zIndex: 1,top: 10,right: 10}} onPress={togglePasswordVisibility}>
                  <Image source={imageHideOrView} style={{width: 30,height: 30,}} ></Image>
                </TouchableOpacity>
              </View>
              <Text style={styles.forgetPasswordButton}
                    onPress={() => {
                      /*linkingUrl()*/
                      navigation.navigate("ForgotPasswordScreen");
                    }}
              >Şifremi unuttum</Text>
              <TouchableOpacity onPress={validateEmail} >
                <LinearGradient colors={['rgb(184,86,196)', 'rgb(121,119,243)']}
                                start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }}
                                style={{width: "100%", height: 45, borderRadius: 5,display: "flex", justifyContent: "center", alignItems: "center"}}>
                  <Text style={{color: "white",fontWeight: "600", fontSize: 20}}>Giriş</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <View style={styles.containerBox}>
              <Text style={styles.title} onPress={() => navigation.navigate('SignupScreen')}>Yeni Hesap Oluştur</Text>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableNativeFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "rgb(12,15,22)",
  },
  tabBars: {
    width: "100%",
    maxHeight: "50%",
    borderBottomRightRadius: 50,
    borderBottomLeftRadius: 50,
  },
  containerBox: {
    width: '70%',
  },
  containerBox1: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerBox2: {
    width: '100%',
    height: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 50,
    fontFamily: 'arial',
    color: 'white',
    zIndex: 100,
  },
  inputBox: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    marginVertical: 10,
  },
  input: {
    width: '100%',
    height: 50,
    paddingLeft: 50,
    paddingRight: 10,
    fontSize: 20,
    color: 'black',
    borderRadius: 5,
    backgroundColor: 'white',
    position: 'relative',
  },
  passwordBox: {
    paddingRight: 50,
  },
  forgetPasswordButton: {
    marginTop: 5,
    marginBottom: 15,
    textAlign: 'right',
    color: "white",
  },
  stick: {
    marginHorizontal: "20%",
    width: "60%",
    height: 2,
    backgroundColor: "rgb(6,18,83)",
    margin: 30,
  },
  otherLoginBox: {
    justifyContent:  "center",
    flexDirection: 'row',
  },
  otherLogin: {
    width: 55,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 30,
    marginHorizontal: 10,
    backgroundColor: 'white',
  },
  image: {
    width: '65%',
    height: '65%',
  },
  title: {
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginVertical: 20,
    color: "white",
  },
  shape1:{
    width: 500,
    height: 500,
    borderRadius: 250,
    backgroundColor: "rgb(184,86,196)",
    position: 'absolute',
    top: -250,
    right: -250,
  },
  shape2:{
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: "rgb(105,121,221)",
    position: 'absolute',
    top: -200,
    right: -200,
  },
  shape3:{
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgb(110,125,221)",
    position: 'absolute',
    top: -150,
    right: -150,
  }
});

export default LoginScreen;
