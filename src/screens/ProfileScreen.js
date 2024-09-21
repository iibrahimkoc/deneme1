import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView, Image,
} from 'react-native';

import { MMKV } from 'react-native-mmkv';
import LinearGradient from 'react-native-linear-gradient';


const storage = new MMKV();

const ProfileScreen = ({ navigation }) => {

  const [mailStatus, setMailStatus] = useState('none');

  const [username, setUsername] = useState('');
  const userEmail = storage.getString('user_email');
  const token = storage.getString('token');

  const getUserInfo = async () => {
    try {
      const getUserInfo = await fetch("https://aigency.dev/api/v1/my-account?access_token="+ token, {
        method: 'GET',
      });
      const getUserData = await getUserInfo.json();
      storage.set('username', getUserData.name);
      setUsername(getUserData.name);
      storage.set('user_email', getUserData.email);
      storage.set('invite_link', getUserData.invite_link);
      storage.set('invite_link_code', getUserData.invite_link.replace("https://aigency.dev/sign-up?invitecode=",""));

      const mailStatus = await await fetch("https://aigency.dev/api/v1/mailStatus/?access_token=" + token,{
        method: 'GET',
      });
      const mailStatusData = await mailStatus.json();
      setMailStatus( mailStatusData.status ? "none" : "flex");
    }
    catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserInfo();
  },[token]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.containerBox}>
        <LinearGradient colors={['rgb(184,86,196)', 'rgb(121,119,243)']}
                        start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }}
                        style={styles.profileBoxGradient}>
          <View style={styles.profileContainer}>
            <View style={styles.profileInfoBox}>
              <View style={styles.profilePhotoBox}>
                <Image style={styles.profilePhoto} source={{uri: "https://aigency.dev/public_uploads/65f5f54299c6e.png"}}></Image>
              </View>
              <Text style={styles.profileUsername}>{username}</Text>
              <Text style={styles.profileEmail}>{userEmail}</Text>
            </View>
          </View>
        </LinearGradient>
        <View style={styles.settings}>
          <View style={[styles.settingBox,{display: mailStatus}]}>
            <TouchableOpacity style={styles.selectedLanguageButton}>
              <Text style={styles.settingBoxText}>Maili Doğrula</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.settingBox}>
            <TouchableOpacity
              style={styles.selectedLanguageButton}
              onPress={() => navigation.navigate("CreditProcess")}>
              <Text style={styles.settingBoxText}>Paketler ve Kredi İşlemleri</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.settingBox}>
            <TouchableOpacity
              style={styles.selectedLanguageButton}
              onPress={() => navigation.navigate("Purchases")}>
              <Text style={styles.settingBoxText}>Satın Alımlarım</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.settingBox}>
            <TouchableOpacity
              style={styles.selectedLanguageButton}
              onPress={() => navigation.navigate("ShareAndWin")}>
              <Text style={styles.settingBoxText}>Davet Et ve Kazan</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.settingBox}>
            <TouchableOpacity style={styles.selectedLanguageButton}
                              onPress={() => {
                                navigation.navigate("PasswordChangeScreen");
                              }}>
              <Text style={styles.settingBoxText}>Şifre Değiştir</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.settingBox}>
            <TouchableOpacity
              onPress={() => {
                storage.delete("user_email");
                storage.delete("user_password")
                storage.clearAll();
                navigation.navigate('LoginScreen')
              }}
              style={styles.selectedLanguageButton}>
              <Text style={styles.settingBoxText}>Çıkış Yap</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(12,15,22)",
  },
  containerBox: {
    margin: '5%',
  },
  profileBoxGradient: {
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  profileContainer: {
    backgroundColor: "rgb(19,24,36)",
    width: '100%',
    height: 200,
    borderRadius: 10,
    position: 'relative',
  },
  profileInfoBox: {
    margin: 'auto',
    alignItems: 'center',
  },
  profilePhotoBox: {
    width: 100,
    height: 100,
    borderRadius: 50,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 5,
    backgroundColor: "rgb(34,42,63)",
    borderStyle: "dashed",
    borderColor: "rgb(19,24,36)",
  },
  profilePhoto: {
    width: 90,
    height: 90,
    borderRadius: 50,
  },
  profileUsername: {
    fontSize: 20,
    marginTop: 10,
    letterSpacing: 0.2,
    fontWeight: 'bold',
    color: "#fff",
  },
  profileEmail: {
    fontSize: 15,
    color: "#fff",
  },
  settings: {
    gap: 10,
    marginVertical: 20,
  },
  settingBox: {
    width: '100%',
    height: 48,
    backgroundColor: "rgb(19,24,36)",
    borderColor: "rgb(34,42,63)",
    borderWidth: 2,
    borderRadius: 10,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  settingBoxText: {
    fontSize: 18,
    color: 'white',
  },
  selectedLanguageButton:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  darkModeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default ProfileScreen;
