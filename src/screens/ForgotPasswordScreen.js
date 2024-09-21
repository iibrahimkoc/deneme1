import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  Image,
  TouchableOpacity,
  ImageBackground,
  Platform, KeyboardAvoidingView, TouchableNativeFeedback,
  Keyboard
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Hata', 'Lütfen e-posta adresinizi girin.');
      return;
    }
    const formData = new FormData();
    formData.append('email', email);
    try {
      const response = await fetch('https://aigency.dev/api/v1/forgotPassword', {
        method: 'POST',
        headers: {},
        body: formData,
      });
      const data = await response.json();
      if (response.ok && data.status) {
        navigation.navigate("PasswordResetCodeScreen");
        Alert.alert('Başarılı', data.message || 'Şifre sıfırlama talebi gönderildi.');
      } else {
        Alert.alert('Hata', data.message || 'Şifre sıfırlama işlemi başarısız oldu.');
      }
    } catch (error) {
      Alert.alert('Hata', 'Bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  return (
    <TouchableNativeFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView style={{flex: 1}}
                            behavior={Platform.OS === 'ios' ? "padding" : "height"}
      >
        <View style={styles.container}>
          <ImageBackground style={styles.containerBox1} source={{uri: "https://aigency.dev/public_uploads/646e062259bce.jpg"}} />
          <View style={styles.containerBox2}>
            <View style={styles.containerBox}>
              <View>
                <Text style={styles.headerText}>Parolayı Sıfırla</Text>
              </View>
              <View style={styles.inputBox}>
                <Image source={require('../assets/images/mail.png')} style={{width: 30,height: 30,position:"absolute", zIndex: 1,top: 10,left: 10}}/>
                <TextInput
                  style={styles.input}
                  placeholder="E-mail"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-addrss"
                  autoCapitalize="none"
                />
              </View>
              <TouchableOpacity onPress={()=>{
                handleForgotPassword();
              }} >
                <LinearGradient colors={['rgb(184,86,196)', 'rgb(121,119,243)']}
                                start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }}
                                style={{width: "100%", height: 45, borderRadius: 5,display: "flex", justifyContent: "center", alignItems: "center"}}>
                  <Text style={{color: "white",fontWeight: "600", fontSize: 18}}>Kurtarma Kodu Gönder</Text>
                </LinearGradient>
              </TouchableOpacity>
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

  },
  containerBox: {
    width: '70%',
  },
  containerBox1: {
    flex: 1,
    width: '100%',
    resizeMode: "contain",
    borderBottomRightRadius: 50,
    borderBottomLeftRadius: 50,
  },
  containerBox2: {
    flex: 1,
    width: '100%',
    height: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 25,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputBox: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    marginVertical: 20,
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
});

export default ForgotPasswordScreen;
