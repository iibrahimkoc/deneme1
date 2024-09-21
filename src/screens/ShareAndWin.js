import React from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity, Share, SafeAreaView} from 'react-native';
import {MMKV} from 'react-native-mmkv';
import LinearGradient from 'react-native-linear-gradient';
import Clipboard from '@react-native-clipboard/clipboard';

const storage = new MMKV();

const ShareAndWin = ({ navigation }) => {
  const invite_link = storage.getString("invite_link");
  const invite_link_code = storage.getString("invite_link_code");

  const writeToClipboard = (text) => {
    Clipboard.setString(text);
  };

  const shareCode = async () => {
    try {
      await Share.share({
        message: invite_link,
      })
    }
    catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.profileButton}
                          onPress={() => {
                            navigation.goBack();
                          }}>
          <Image source={require('../assets/images/arrowBack.png')} style={styles.profileIcon}/>
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>DAVET ET</Text>
        </View>
        <View style={styles.profileButton} />
      </View>

      <LinearGradient colors={['rgb(184,86,196)', 'rgb(121,119,243)']}
                      start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }}
                      style={{width: "100%", height: 2}} />

      <View style={styles.boxContainer}>
        <View style={styles.box}>
          <Text style={styles.inviteLinkText}>Arkadaşlarını davet et, ödüller senin olsun! Davet kodunu paylaşarak arkadaşlarının uygulamamıza katılmasını sağla ve her başarılı davetten 30.000 kredi kazan. Ne kadar çok davet, o kadar çok ödül! Şimdi paylaşmaya başla ve kazanmaya devam et!</Text>
          <View style={styles.inviteLink}>
            <View style={styles.inviteLinkCode}>
              <Text style={styles.text}>{invite_link_code}</Text>
            </View>
            <TouchableOpacity
              style={styles.inviteLinkButton}
              onPress={() => writeToClipboard(invite_link_code)}>
              <Image source={require("../assets/images/copy.png")} style={styles.inviteLinkButtonImage}></Image>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity style={[styles.box,styles.shareBox]} onPress={() => shareCode()}>
          <Text style={styles.text}>DAVET ET ve KAZAN!</Text>
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
  profileIcon: {
    width: 30,
    height: 30,
  },
  title:{
    fontSize: 22,
    fontWeight: 'bold',
    color: "#fff",
  },
  profileButton: {
    width: 30,
    height: 30,
  },
  inviteLinkText: {
    color: '#fff',
    fontSize: 16,
  },
  text: {
    color: '#fff',
  },
  boxContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'cloumn',
    alignItems: 'center',
    paddingTop: 15,
  },
  box: {
    width: '90%',
    backgroundColor: "rgb(19,24,36)",
    borderColor: "rgb(34,42,63)",
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  inviteLink:{
    backgroundColor: "rgb(12,15,22)",
    borderColor: "rgb(34,42,63)",
    borderRadius: 5,
    borderWidth: 2,
    display: "flex",
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "space-between",
    height: 50,
    paddingHorizontal: 10,
    marginVertical: 5,
    marginTop: 20,
  },
  inviteLinkCode:{

  },
  inviteLinkButton: {
    width: 30,
    height: 30,
  },
  inviteLinkButtonImage: {
    width: 30,
    height: 30,
  },
  shareBox: {
    marginTop: 15,
    paddingVertical: 13,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }
})
export default ShareAndWin;
