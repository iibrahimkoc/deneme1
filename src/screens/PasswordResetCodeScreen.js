import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView, Platform, TouchableNativeFeedback, Keyboard,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const PasswordResetCodeScreen = ({ navigation }) => {


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
                <Text style={styles.headerText}>Doğrulama Kodu</Text>
              </View>
              <View style={styles.inputBox}>
                <TextInput
                  style={styles.input}
                  placeholder="Parola Yenileme Kodu"
                  keyboardType="number-pad"
                  keyboardAppearance={"dark"}
                  autoCapitalize="none"
                />
              </View>
              <TouchableOpacity onPress={()=>{
                //BURADA SERVER KODU ÇALIŞACAK
              }} >
                <LinearGradient colors={['rgb(184,86,196)', 'rgb(121,119,243)']}
                                start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }}
                                style={{width: "100%", height: 45, borderRadius: 5,display: "flex", justifyContent: "center", alignItems: "center"}}>
                  <Text style={{color: "white",fontWeight: "600", fontSize: 18}}>Devam</Text>
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
    marginBottom: 10,
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
    paddingHorizontal: 10,
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

export default PasswordResetCodeScreen;
