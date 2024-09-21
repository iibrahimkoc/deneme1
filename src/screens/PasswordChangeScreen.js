import React from 'react';
import {View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, TextInput, Alert} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {MMKV} from 'react-native-mmkv';

const storage = new MMKV();

const PasswordChangeScreen = ({navigation}) => {

  const email = storage.getString('user_email');
  const password = storage.getString('user_password');

  const [password1, setPassword1] = React.useState('');
  const [password2, setPassword2] = React.useState('');

  const isSamePassword = (password1, password2) => {
    if(password1 !== null && password2 !== null && password1 !== undefined && password2 !== undefined && password1 !== "" && password2 !== "" ) {
      if(password1 == password2) {
        runSelenium();
        return true;
      }
      else {
        console.log("şifreler aynı olmalı")
        return false;
      }
    }
    else{
      console.log("boş bırakılamaz")
      return false;
    }
  }
  const runSelenium = async () => {
    try {
      const response = await fetch('http://localhost:3000/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, password1 }),
      });

      const data = await response.text();
      if (data !== "Hata-1212") {
        console.log(data);
        Alert.alert('Şifre Değiştirme', data);
        storage.set('user_password', password1);
        navigation.goBack();
      }

    } catch (error) {
      console.error('Error triggering Selenium:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require("../assets/images/arrowBack.png")} style={styles.headerIcon}></Image>
        </TouchableOpacity>
        <Text style={styles.title}>ŞİFRE YENİLEME</Text>
        <View style={styles.headerIcon}></View>
      </View>

      <LinearGradient colors={['rgb(184,86,196)', 'rgb(121,119,243)']}
                      start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }}
                      style={{width: "100%", height: 2}} />

      <View style={styles.body}>
        <TextInput
          placeholder={"Yeni Şifreni Giriniz"}
          placeholderTextColor={"rgb(110,116,124)"}
          autoCorrect={false}
          onChangeText={text => setPassword1(text)}
          contextMenuHidden={true} //kopyala-yapıştırı engelledi
          autoCapitalize={'none'}
          style={styles.input}
        />
        <TextInput
          placeholder={"Şifreyi Tekrar Giriniz"}
          placeholderTextColor={"rgb(110,116,124)"}
          autoCorrect={false}
          onChangeText={text => setPassword2(text)}
          contextMenuHidden={true}
          style={styles.input}
          autoCapitalize={'none'}
        />
        <TouchableOpacity
          onPress={() => {
            isSamePassword(password1, password2);
          }}>
          <LinearGradient colors={['rgb(184,86,196)', 'rgb(121,119,243)']}
                          start={{ x: 0.4, y: 0.5 }} end={{ x: 1.0, y: 1.0 }}
                          style={styles.packageBoxButton}>
            <Text style={styles.packageBoxInfoBoxText}>Kaydet</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(12,15,22)",
  },
  header:{
    width: '100%',
    paddingHorizontal: '6%',
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: "rgb(12,15,22)",
  },
  headerIcon: {
    width: 30,
    height: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: "#fff",
  },
  body: {
    flexDirection: "column",
    paddingHorizontal: '5%',
    paddingTop: 20,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: 'rgb(20,22,42)',
    borderColor: "rgb(34,42,63)",
    borderWidth: 2,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 17,
    letterSpacing: 0.3,
    marginBottom: 20,
    color: "white",
  },
  inputPlaceholder: {
    fontWeight: 'bold',
  },
  packageBoxButton: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  packageBoxInfoBoxText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },

})

export default PasswordChangeScreen;
