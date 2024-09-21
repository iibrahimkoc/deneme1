import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView, useWindowDimensions, ActivityIndicator, Modal, TouchableNativeFeedback,
} from 'react-native';

import {MMKV} from 'react-native-mmkv';
import LinearGradient from 'react-native-linear-gradient';

const storage = new MMKV();

const ResumeMessageScreen = ({navigation}) => {

  const ai_id = storage.getNumber("ai_id");
  const ai_name = storage.getString("ai_name");
  const token = storage.getString("token");
  const [ai_desc, setAiDesc] = useState([]);
  const [isVipOptions, setIsVipOptions] = useState(false);
  const [vipOptionsModal, setVipOptionsModal] = useState(false);

  const [myChats, setMyChats] = useState([]);

  const { width } = useWindowDimensions();

  const getAiDesc = async () => {
    try{
      const getAiDescResponse = await fetch(`https://aigency.dev/api/v1/my-chats?access_token=${token}`, {
        method: 'GET',
      })
      const getAiDescData = await getAiDescResponse.json();

      //KODDA HATA YOK HİÇ KONUŞULMAMIŞ BİR SOHBETTE Aİ AÇIKLAMA VERİSİ YOK ÇÜNKÜ BİZ BU VERİYİ ESKİ KONUŞMA SOHBET DOSYASINDAN ALIYORUZ.
      if(getAiDescData.length > 0 && getAiDescResponse.ok){
        const filteredAi = getAiDescData.filter((item) => item.ai_name === ai_name);
        const aiDesc = filteredAi[0].ai_desc;
        setAiDesc(aiDesc);
      }
    }
    catch (error) {
      console.log(error);
    }
  }

  const [newChatBox, setNewChatBox] = useState(false);
  const chats = async () => {
    try{
      const myToken = storage.getString("token");
      const response = await fetch("https://aigency.dev/api/v1/view-chats?access_token="+ myToken +"&ai_id=" + ai_id,{
        method: 'GET',
      });
      const data = await response.json();
      if(response.ok && data.length == 0) {
        setNewChatBox(true);
      }
      else{
        setMyChats(data);
      }

    }
    catch (error) {
      console.log(error);
    }
  };

  const getIsAiVip = async () => {
    try {
      const getIsAiVipResponse = await fetch("https://aigency.dev/api/v1/ai-team-list/?access_token="+token,{
        method:"GET"
      })
      const getIsAiVipData = await getIsAiVipResponse.json();
      if(getIsAiVipData.length > 0) {
        const filteredAi = getIsAiVipData.filter((item) => item.ai_name === ai_name);
        const isvip = filteredAi[0].is_vip;
        setIsVipOptions(isvip);
      }
    }
    catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getAiDesc();
    chats();
    getIsAiVip();
  }, [token])

  const getThread = async () => {
    const getThreadBody = new FormData();
    getThreadBody.append("access_token", token);
    getThreadBody.append("ai_id", ai_id);
    try{
      const getThreadResponse = await fetch("https://aigency.dev/api/v1/newChat", {
        method: 'POST',
        body: getThreadBody,
      })

      const getThreadData = await getThreadResponse.json();
      storage.set("chat_id", getThreadData.chat_id);
    }
    catch(error){
      console.log(error);
    }
  }

  const isVipControl = async () => {
    if(isVipOptions == true){
      try{
        const myPurchasesResponse = await fetch("https://aigency.dev/api/v1/my-purchases?access_token="+token,{
          method: 'GET',
        });
        const myPurchasesData = await myPurchasesResponse.json();
        const myPurchasesNames = []
        myPurchasesData.forEach((item) => { myPurchasesNames.push(item.product_name);});

        const pricingListResponse = await fetch("https://aigency.dev/api/v1/pricing-list?access_token="+token,{
          method: 'GET',
        });
        const pricingListData = await pricingListResponse.json();
        const aiListControlData = [];
        myPurchasesNames.forEach((item) => {
          const finded = pricingListData.find((item2) => item2.package_name === item);
          if(finded) {
            aiListControlData.push(finded.package_ai_list);
          }
        });
        var aiControl = false;
        aiListControlData.forEach(item => {
          item.forEach(item2 => {
            if(item2.name == ai_name){
              aiControl = true;
            };
          })
        })

        if(aiControl == true){
          getThread();
          storage.set("ai_name", ai_name);
          storage.set("ai_id", ai_id);
          navigation.navigate('ResumeTalkScreen',);
        }
        else{
          setVipOptionsModal(true);
          console.log("yetkin yok");
        }
      }
      catch(error){
        console.log(error);
      }
    }
    else{
      getThread();
      storage.set("ai_name", ai_name);
      storage.set("ai_id", ai_id);
      navigation.navigate('ResumeTalkScreen',);
    }
  }

  const isLargeScreen = width > 600;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
            storage.delete("ai_desc");
          }} style={styles.headerIcon}>
          <Image source={require("../assets/images/arrowBack.png")} style={styles.headerIcon}></Image>
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>{String(ai_name).toUpperCase()}</Text>
          <Text style={styles.aiDescTitle}>{ai_desc}</Text>
        </View>
        <TouchableOpacity style={styles.headerIcon}
                          onPress={() => {
                            isVipControl();
                          }}>
          <Image source={require('../assets/images/add.png')} style={styles.headerIcon}/>
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.aiBox}>
        <View
          style={[styles.gridContainer, isLargeScreen && styles.gridContainerLarge]}
        >
          {myChats.length > 0 ?(
            myChats.map((chat, index) => (
              <TouchableOpacity key={index} style={[styles.box1, isLargeScreen ? styles.largeBox : styles.smallBox]}
                                onPress={() => {
                                  storage.set("chat_id", chat.chat_id);
                                  storage.set("download_docx", chat.download_docx);
                                  storage.set("download_pdf", chat.download_pdf);
                                  storage.set("download_txt", chat.download_txt);
                                  navigation.navigate('ResumeTalkScreen');
                                }}>
                <View style={styles.aiTextBox}>
                  <View style={styles.aiInfoHeaderBox}>
                    <Text style={styles.aiInfoHeaderName}>{chat.chat_name}</Text>
                  </View>
                  <View style={styles.aiInfoTextBox}>
                    <Text numberOfLines={3} style={styles.aiInfoText}><Text style={{fontWeight:"bold",color: 'rgb(110,135,201)'}}>Son Mesaj:  </Text>{chat.last_message}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) :
            //KONUŞMALAR YÜKLENİRKEN
            newChatBox == false ?
            (
            <View style={styles.containerBox}>
              <ActivityIndicator size={"large"} color={"#fff"}></ActivityIndicator>
            </View>
          ) : (
            //EĞER HİÇ KONUŞMA OLMADIYSA
            <View style={styles.containerBox}>
              <View style={styles.newStartedScreenBox}>
                <Image style={styles.newStartedScreenBoxImage} source={require("../assets/images/emptyMessage.png")} />
                <Text style={{color: "white", fontSize: 16}}>Tüh! Henüz bir sohbetimiz yok ama {ai_name} seni dinlemeye hazır. Hadi, ona ilk sorunu sor ve neler diyeceğini keşfet!</Text>
                <TouchableOpacity
                  onPress={() => {
                    isVipControl();
                  }}>
                  <LinearGradient colors={['rgb(184,86,196)', 'rgb(121,119,243)']}
                                  start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }}
                                  style={styles.newStartedScreenBoxButton}>

                    <Text style={{color:"white",fontWeight: "bold"}}>{String(ai_name).toUpperCase()} ile Sohbete Başla</Text>

                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
            )}
        </View>
      </ScrollView>

      {/* VİP ÖNERİ PAKET MODALI */}
      <Modal
        animationType={"fade"}
        transparent={true}
        visible={vipOptionsModal}
        onRequestClose={() => setVipOptionsModal(false)}
        supportedOrientations={["portrait","landscape"]}
      >
        <TouchableNativeFeedback  onPress={() => setVipOptionsModal(false)}>
          <View style={styles.vipOptionsModalOverlay}>
            <TouchableNativeFeedback>
              <View style={styles.vipOptionsModalBox}>
                <View style={styles.vipOptionsModalBoxInfo}>
                  <View style={{flexDirection: "row",justifyContent: "space-between", alignItems:"center"}}>
                    <Text style={styles.vipOptionsModalBoxInfoHeader}>Yetersiz Paket 🌟</Text>
                    <TouchableOpacity style={styles.vipOptionsModalBoxInfoIcon} onPress={() => setVipOptionsModal(false)}>
                      <Image style={styles.vipOptionsModalBoxInfoIcon} source={require("../assets/images/close.png")}/>
                    </TouchableOpacity>
                  </View>
                  <Text style={{color: "white",marginVertical: 10,}}>Daha fazla özellik ve ayrıcalık için VIP üyeliğe geçiş yapın. Şimdi <Text style={{fontWeight:"bold"}}>VIP</Text> olun ve tüm avantajlardan faydalanın!</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setVipOptionsModal(false)
                      navigation.navigate("CreditProcess")
                    }}>
                    <LinearGradient colors={['rgb(184,86,196)', 'rgb(121,119,243)']}
                                    start={{ x: 0.4, y: 0.5 }} end={{ x: 1.0, y: 1.0 }}
                                    style={styles.packageBoxButton}>
                      <Text style={styles.packageBoxInfoBoxText}>SATIN AL</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableNativeFeedback>
          </View>
        </TouchableNativeFeedback>
      </Modal>

    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(12,15,22)",
  },
  containerBox: {
    flex: 1,
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  newStartedScreenBox:{
    marginHorizontal: '6%',
    paddingVertical: 15,
    paddingHorizontal: 10,
    width: '88%',
    maxWidth: 400,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    borderWidth:1,
    borderColor: "rgb(34,42,63)",
    borderRadius: 5,
    backgroundColor: "rgb(19,24,36)",
  },
  newStartedScreenBoxImage: {
    width: 50,
    height: 50,
    aspectRatio: 1,
    resizeMode: "contain",
    marginBottom: 15,
  },
  newStartedScreenBoxButton: {
    padding: 10,
    marginTop: 15,
    borderRadius: 10,
  },
  header:{
    width: '100%',
    paddingHorizontal: '6%',
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: "rgb(130,136,174)",
  },
  back: {
    color: "#fff",
  },
  title:{
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
  },
  aiDescTitle: {
    color: 'rgb(110,135,201)',
    fontSize: 13,
    textAlign: 'center',
  },
  headerIcon: {
    width: 30,
    height: 30,
  },
  aiBox: {
    width: '100%',
  },
  gridContainer: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    display: 'flex',
    alignItems: 'center',
    paddingVertical: 20,
  },
  gridContainerLarge: {
    flexDirection: "row",
    flexWrap: 'wrap',
    paddingHorizontal: '5%',
    justifyContent: 'space-between',
    alignItems: "stretch",
    paddingVertical: 20,
  },
  box1: {
    borderWidth: 2,
    borderColor: "rgb(34,42,63)",
    backgroundColor: "rgb(19,24,36)",
    marginBottom: 15,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 15,
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
  aiTextBox: {
    width: '100%',
  },
  aiInfoHeaderBox: {
    width: '100%',
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    justifyContent: "flex-start",
  },
  aiInfoHeaderName: {
    fontWeight: 'bold',
    color: "white"
  },
  aiInfoHeaderDesc:{
    textAlign: 'center',
    fontWeight: 'bold',
    color: "white"
  },
  aiInfoTextBox: {
    marginTop: 10,
    justifyContent: 'center',
  },
  aiInfoText: {
    color: "white"
  },
  vipOptionsModalOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  vipOptionsModalBox:{
    width: '100%',
    height: "auto",
    padding: '3%',
    display:"flex",
    alignItems: 'center',
    justifyContent: 'center',
  },
  vipOptionsModalBoxInfo: {
    width: 300,
    height: "auto",
    backgroundColor: "rgb(12,15,22)",
    borderColor: "rgb(34,42,63)",
    borderWidth: 2,
    borderRadius: 10,
    padding: 10,
  },
  vipOptionsModalBoxInfoHeader: {
    color: "white",
    fontWeight: 'bold',
    fontSize: 22,
  },
  vipOptionsModalBoxInfoIcon: {
    width: 30,
    height: 30
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
export default ResumeMessageScreen;
