import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  useWindowDimensions, RefreshControl, Alert,
} from 'react-native';

import {MMKV} from 'react-native-mmkv';
import LinearGradient from 'react-native-linear-gradient';


const storage = new MMKV();

const MessageHistoryScreen = ({navigation}) => {
  const token = storage.getString('token');
  const { width } = useWindowDimensions();

  const email = storage.getString('user_email');
  const password = storage.getString('user_password');
  const [myCredit, setMyCredit] = useState('');

  const runSelenium = async () => {
    try {
      const response = await fetch('http://localhost:3000/get-credits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.text();
      if (data !== "Hata-1212") {
        if(data.includes("Kredilerim")){
          setMyCredit(data);
        }
        else{
          setMyCredit("Hata");
        }
      }
    } catch (error) {
      console.error('Error triggering Selenium:', error);
    }
  };

  const [myChats, setMyChats] = useState([]);
  const chats = async () => {
    try{
      const response = await fetch("https://aigency.dev/api/v1/my-chats?access_token=" + token,{
        method: 'GET',
      });
      const photoResponse = await fetch("https://aigency.dev/api/v1/pricing-list?access_token="+token,{
        method: 'GET',
      })
      const photoData = await photoResponse.json();
      const photoDataFilter = photoData.filter((item) => item.package_name == "VIP PACKAGE")[0].package_ai_list;

      const data = await response.json();
      const myData = [];
      data.forEach((item) => {
        const eslesme = photoDataFilter.find((item2) => item2.name === item.ai_name);
        if (eslesme) {
          myData.push({ ...item, img_uri: eslesme.img_uri });
        }
      });
      setMyChats(myData);
    }
    catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    runSelenium()
    chats();
  }, [token]);

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      runSelenium();
      chats();
      setRefreshing(false);
    })
  }, [token]);

  const isLargeScreen = width > 600;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>SOHBETLERİM</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('CreditProcess')}>
          <LinearGradient colors={['rgb(184,86,196)', 'rgb(121,119,243)']}
                          start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }}
                          style={styles.creditBoxGradient} >
            <View style={styles.creditBox}>
              <Text style={styles.creditBoxText}>{myCredit}</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>
      <LinearGradient colors={['rgb(184,86,196)', 'rgb(121,119,243)']}
                      start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }}
                      style={{width: "100%", height: 2}} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.aiBox}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={"white"}
            colors={["white"]}
          />
        }
      >
        <View
          style={[styles.gridContainer, isLargeScreen && styles.gridContainerLarge]}
        >
          {myChats.length > 0 ?(
            myChats.map((chat, index) => (
              <TouchableOpacity key={index} style={[styles.box1, isLargeScreen ? styles.largeBox : styles.smallBox]}
                                onPress={() => {
                                  storage.set("ai_id", chat.ai_id);
                                  storage.set("ai_name", chat.ai_name);
                                  storage.set("ai_desc", chat.ai_desc);
                                  navigation.navigate('ResumeMessageScreen');
                                }}>
                <View style={styles.photo}>
                  <Image source={{uri: chat.img_uri}} style={styles.photoImage}></Image>
                </View>
                <View style={styles.stick}></View>
                <View style={styles.aiTextBox}>
                  <View style={styles.aiInfoHeaderBox}>
                    <Text style={styles.aiInfoHeaderName}>{chat.ai_name.toUpperCase()}</Text>
                    <Text numberOfLines={1} style={styles.aiInfoHeaderDesc}>{chat.ai_desc}</Text>
                  </View>
                  <View style={styles.aiInfoTextBox}>
                    <View style={styles.aiInfoTextBoxContainer}>
                      <Image source={{uri: 'https://aigency.dev/img/chat.png'}} style={styles.uriImage}></Image>
                      <Text style={styles.aiInfoText}>{chat.total_chats} Sohbet</Text>
                    </View>
                    <View style={styles.aiInfoTextBoxContainer}>
                      <Image source={{uri: 'https://aigency.dev/img/message.png'}} style={styles.uriImage}/>
                      <Text style={styles.aiInfoText}>{chat.total_messages} Mesaj</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={{ textAlign: 'center', marginTop: 20 }}> Yükleniyor...</Text> // Veri yüklenirken gösterilecek mesaj
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "rgb(12,15,22)",
  },
  header:{
    width: '100%',
    paddingHorizontal: '6%',
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  creditBoxGradient: {
    borderStyle:"solid",
    borderColor: "transparent",
    borderRadius: 5,
    padding: 2,
  },
  creditBox: {
    minWidth: 100,
    backgroundColor: "rgb(32,33,37)",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  creditBoxText: {
    color: "white",
    textAlign:"center",
  },
  title:{
    fontSize: 22,
    fontWeight: 'bold',
    color: "#fff",
  },
  aiBox: {
    width: '100%',
    display: 'flex',
  },
  gridContainer: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    display: 'flex',
    alignItems: 'center',
    paddingTop: 20,
  },
  gridContainerLarge: {
    flexDirection: "row",
    flexWrap: 'wrap',
    paddingHorizontal: '5%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
  },
  box1: {
    padding: 10,
    borderWidth: 2,
    borderColor: "rgb(34,42,63)",
    backgroundColor: "rgb(19,24,36)",
    marginBottom: 15,
    borderRadius: 10,
    alignItems: 'center',
    paddingHorizontal: 10,
    flexDirection: 'row',
    display: 'flex',
  },
  smallBox: {
    width: '90%',
    marginHorizontal: "5%"
  },
  largeBox:{
    width: '48%',
  },
  photo: {
    width: '30%',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  photoImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 200,
  },
  stick: {
    height: '80%',
    borderRightWidth: 2,
    borderColor: "rgb(132,138,175)",
    marginHorizontal: 10,
  },
  aiTextBox: {
    flex: 2,
    display: "flex",
    height: 100,
    flexDirection: 'column',
    justifyContent: "space-between",
  },
  aiInfoHeaderBox: {
    width: '100%',
    height: "auto",
    flexDirection: 'column',
  },
  aiInfoHeaderName: {
    width: '50%',
    fontWeight: 'bold',
    color: '#fff',
  },
  aiInfoHeaderDesc:{
    marginTop: 2,
    width: '100%',
    fontWeight: '600',
    color: 'rgb(110,135,201)',
  },
  aiInfoTextBoxContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiInfoTextBox: {
    width: '100%',
    height: "auto",
    flexDirection: "row",
    display: 'flex',
    justifyContent: 'space-around',
  },
  aiInfoText: {
    textAlign: 'justify',
    color: '#fff',
  },
  uriImage: {
    width: 25,
    height: 25,
  }
})

export default MessageHistoryScreen
