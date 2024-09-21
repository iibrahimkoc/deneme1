import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  Alert,
  TouchableOpacity,
  TouchableNativeFeedback,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const SignupScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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

  const handleSignup = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Geçersiz Email', 'Lütfen geçerli bir mail adresi giriniz.');
      return;
    }

    // FormData nesnesi oluşturuluyor
    const formData = new FormData();
    formData.append('name', username);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('terms_rules', 'checked');  // Şartlar ve Koşullar alanı eklendi

    try {
      const response = await fetch('https://aigency.dev/api/v1/register', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();


      if (response.ok) {
        Alert.alert('Başarılı', 'Kayıt işlemi başarılı!');
        navigation.navigate('AIsScreen');
      } else {
        Alert.alert('Hata', data.message || 'Kayıt işlemi başarısız oldu.');
      }
    } catch (error) {
      Alert.alert('Hata', 'Bir hata oluştu. Lütfen tekrar deneyin.');
    }
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
              <Text style={styles.headerText}>Kayıt Ol</Text>
            </View>
          </LinearGradient>
          <View style={styles.containerBox2}>
            <View style={styles.containerBox}>
              <View style={styles.inputBox}>
                <Image source={require('../assets/images/profileCircle.png')} style={{width: 30,height: 30,position:"absolute", zIndex: 1,top: 10,left: 10}}/>
                <TextInput
                  placeholder="Kullanıcı Adı"
                  value={username}
                  onChangeText={(text) => setUsername(text)}
                  style={styles.input}
                  autoCapitalize="none"
                />
              </View>
              <View style={styles.inputBox}>
                <Image source={require('../assets/images/mail.png')} style={{width: 30,height: 30,position:"absolute", zIndex: 1,top: 10,left: 10}}/>
                <TextInput
                  placeholder="E-mail"
                  keyboardType="email-addrss"
                  value={email}
                  onChangeText={(text) => setEmail(text)}
                  style={styles.input}
                  autoCapitalize="none"
                />
              </View>
              <View style={styles.inputBox}>
                <Image source={require('../assets/images/password.png')} style={{width: 30,height: 30,position:"absolute", zIndex: 1,top: 10,left: 10}}/>
                <TextInput
                  placeholder="Şifre"
                  value={password}
                  onChangeText={text => setPassword(text)}
                  secureTextEntry={secureTextEntryBox}
                  style={styles.input}
                  autoCapitalize="none"
                />
                <TouchableOpacity style={{width: 30,height: 30,position:"absolute", zIndex: 1,top: 10,right: 10}} onPress={togglePasswordVisibility}>
                  <Image source={imageHideOrView} style={{width: 30,height: 30}}/>
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => handleSignup()} >
                <LinearGradient colors={['rgb(184,86,196)', 'rgb(121,119,243)']}
                                start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }}
                                style={{width: "100%", height: 45, borderRadius: 5,display: "flex", justifyContent: "center", alignItems: "center"}}>
                  <Text style={{color: "white",fontWeight: "600", fontSize: 20}}>Kayıt Ol</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
            <Text style={styles.title} onPress={() => navigation.navigate('LoginScreen')}>Zaten bir hesabım var.</Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableNativeFeedback>
  );
}
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
    justifyContent: 'center',
    alignItems: 'center',
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
    zIndex: 100
  },
  formContainer: {
    padding: 20,
  },
  inputBox: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    marginBottom: 10,
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
  title:{
    marginVertical: 20,
    textDecorationLine: 'underline',
    color: "white"
  },
  shape1:{
    width: 500,
    height: 500,
    borderRadius: 250,
    backgroundColor: "rgb(98,116,221)",
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

export default SignupScreen;
