import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput, FlatList, Image, Linking, ActivityIndicator,
} from 'react-native';

import { MMKV } from 'react-native-mmkv';
import LinearGradient from 'react-native-linear-gradient';


const storage = new MMKV();

const ResumeTalkScreen = ({ navigation }) => {
  const ai_name = storage.getString("ai_name");
  const token = storage.getString("token");
  const chat_id = storage.getString("chat_id");

  const download_docx = storage.getString("download_docx");
  const download_pdf = storage.getString("download_pdf");
  const download_txt = storage.getString("download_txt");

  const [myChat, setMyChat] = useState(null);
  const [myMessage, setMyMessage] = useState('');
  const [dangerBoxView, setDangerBoxView] = useState("none");

  const flatListRef = useRef(null);

  useEffect(() => {
    const resumeMessage = async () => {
      const resumeMessageFormData = new FormData();
      resumeMessageFormData.append("access_token", token);
      resumeMessageFormData.append("chat_id", chat_id);
      try {
        const resumeMessageResponse = await fetch("https://aigency.dev/api/v1/resumeChat/", {
          method: 'POST',
          body: resumeMessageFormData,
        });
        const resumeMessageData = await resumeMessageResponse.json();
        console.log(resumeMessageData);
        setMyChat(resumeMessageData);
      } catch (error) {
        console.log(error);
      }
    };
    resumeMessage();
  }, [chat_id, token]);

  const [imageDalleUrl, setImageDalleUrl] = useState([]);

  const createImageDalle = async () => {
    const createImageDalleFormData = new FormData();
    createImageDalleFormData.append("access_token", token);
    createImageDalleFormData.append("chat_id", chat_id);
    createImageDalleFormData.append("prompt", myMessage);
    try {
      const createImageDalleResponse = await fetch("https://aigency.dev/api/v1/DalleCreate/",{
        method: 'POST',
        body: createImageDalleFormData,
      })
      console.log("resim çizmeye başladı")
      const createImageDalleData = await createImageDalleResponse.json();
      const url =  createImageDalleData.message.data[0].url;
      setImageDalleUrl(url);
      console.log(url);

      let veri = myChat?.messages || [];
      let aiMessages = {message: url, from: "assistant", type: "image"}
      veri.push(aiMessages);
      setMyChat({ ...myChat, messages: veri  });
      console.log("veri", myChat);
      flatListRef.current?.scrollToEnd({ animated: true });
      setSendButtonShow("none");
    }
    catch (error) {
      console.log(error);
    }
  }


  const sendMessage = async () => {
    const sendFormData = new FormData();
    sendFormData.append('access_token', token);
    sendFormData.append('chat_id', chat_id);
    sendFormData.append('message', myMessage);

    try {
      const sendResponse = await fetch("https://aigency.dev/api/v1/sendMessage", {
        method: 'POST',
        body: sendFormData,
      });

      if (!sendResponse.ok) {
        throw new Error(`HTTP error! status: ${sendResponse.status}`);
      }

      const sendData = await sendResponse.json();
      if (sendData && sendData.answer) {
        let veri = myChat?.messages || [];
        let aiMessages = sendData.answer;
        veri.push(aiMessages);
        setMyChat({ ...myChat, messages: veri});
        flatListRef.current?.scrollToEnd({ animated: true });
        setSendButtonShow("none");
      }
      else if(sendData.answer == null){
        setDangerBoxView("flex");
        setTimeout(() => {setDangerBoxView("none")},5000);
        flatListRef.current?.scrollToEnd({ animated: true });
        setSendButtonShow("none");
      }
      else {
        console.log("Yanıt veri yapısı beklenmedik.");
      }

    } catch (error) {
      console.log("Mesaj gönderme hatası:", error);
    }
  };

  const linkingUrl = (url) => {
    Linking.openURL(url).catch((err) => {console.log(err)});
  }


  const renderMessageItem = ({ item }) => {
    if (item.type == "image") {
      console.log("resim çizmek için burdydı")
      return (
        <View key={item.id} style={item.from === 'user' ? styles.userMessageBox : styles.aiMessageBox}>
          <View style={item.from === 'assistant' ? styles.aiMessage : styles.userMessage}>
            <Image style={{width: 250, height: 250, maxWidth:300, maxHeight:300, borderRadius: 5}} source={{uri: item.message}}></Image>
          </View>
        </View>
      )
    }
    else{
      return (
        <View key={item.id} style={item.from === 'user' ? styles.userMessageBox : styles.aiMessageBox}>
          <View style={item.from === 'assistant' ? styles.aiMessage : styles.userMessage}>
            <Text style={{color: "white"}}>{item.message}</Text>
          </View>
        </View>
      )
    }
  };

  const myChatAdd = (myMsg) =>{
    let veri = myChat.messages;
    let myMessage = {message : myMsg, from: "user"}
    veri.push(myMessage);
    myChat.messages = veri;
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  const [sendButtonShow, setSendButtonShow] = useState("none");

  const messageControl = () => {
    if(myMessage == null || myMessage === "" || myMessage == undefined){
      console.log(1)
    }
    else if (myMessage.includes("/img")) {
      console.log("foto üretiyo")
      setMyMessage(myMessage.replace("/img",""));
      myChatAdd(myMessage);
      setMyMessage(null);
      createImageDalle();
    }
    else{
      setSendButtonShow("flex");
      myChatAdd(myMessage);
      sendMessage();
      setMyMessage(null);
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => {
            navigation.goBack();
            storage.delete("chat_id");
            setMyChat(null);

          }}>
          <Image source={require("../assets/images/arrowBack.png")} style={styles.backButton}></Image>
        </TouchableOpacity>
        <Text style={styles.title}>{ai_name}</Text>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => {
            linkingUrl(download_pdf);
          }}
        >
          <Image source={require("../assets/images/downloadButton.png")} style={styles.downloadButton}></Image>
        </TouchableOpacity>
      </View>

      <LinearGradient colors={['rgb(184,86,196)', 'rgb(121,119,243)']}
                      start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }}
                      style={{width: "100%", height: 2}} />

      <SafeAreaView style={[styles.boxBox,{display: dangerBoxView}]}>
        <TouchableOpacity style={styles.boxbox1} onPress={() => navigation.navigate("CreditProcess")}>
          <Image style={{width: 40, aspectRatio:1, resizeMode:"contain", marginRight: 10,}} source={require("../assets/images/danger.png")}></Image>
          <Text style={{color: "white"}}>Krediniz Tükendi! Sohbete devam etmek için kredi satın alınız.</Text>
        </TouchableOpacity>
      </SafeAreaView>

        {myChat ? (
          <FlatList
            ref={flatListRef}
            data={myChat.messages?.filter((item) => item.from === "user" || item.from === "assistant")}
            renderItem={renderMessageItem}
            keyExtractor={(item, index) => index.toString()}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          >
          </FlatList>
        ) : (
          <View style={styles.containerBox}>
            <ActivityIndicator size={"large"} color={"#fff"}></ActivityIndicator>
          </View>
        )}


      <LinearGradient colors={['rgb(184,86,196)', 'rgb(121,119,243)']}
                      start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }}
                      style={{width: "100%", height: 2, marginBottom: 10}} />
      <View style={styles.sendMessageBox}>
        <LinearGradient colors={['rgb(19,20,36)', 'rgb(24,35,61)']}
                        start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }}
                        style={{width: "77%", borderRadius: 5, borderWidth: 2, borderColor: "rgb(74,79,96)"}}
        >
          <TextInput
            placeholder={'Mesajınızı buraya yazın'}
            placeholderTextColor={"rgb(165,167,211)"}
            style={styles.input}
            value={myMessage}
            onChangeText={(myMessage) => setMyMessage(myMessage)}
          />
        </LinearGradient>

        <LinearGradient colors={['rgb(18,19,36)', 'rgb(40,82,138)']}
                        start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }}
                        style={{width: "18%", borderRadius: 5,display: 'flex', justifyContent: 'center', alignItems: 'center'}}
        >
          <View style={{display: "flex",position: "relative"}}>
            <TouchableOpacity
              style={styles.sendMessageButtonBox}
              onPress={() => {
                console.log("bu gönderilecek mesaj: ", myMessage);
                messageControl()
              }}>
              <Text style={{color:"white", fontWeight:600}}>Gönder</Text>
            </TouchableOpacity>
            <View style={{display: sendButtonShow,position:"absolute", backgroundColor: "transparent",zIndex: 100,width: "100%", height: "100%"}}></View>
          </View>
        </LinearGradient>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(12,15,22)",
  },
  boxBox: {
    height: 80,
    width: "100%",
    paddingHorizontal: "5%",
    alignItems: "center",
    justifyContent: "center",
  },
  boxbox1: {
    width: "100%",
    height: 60,
    borderRadius: 10,
    paddingLeft: 10,
    paddingRight: 60,
    backgroundColor: "rgb(187,33,36)",
    flexDirection: "row",
    alignItems: "center",
  },
  containerBox: {
    flex:1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
    paddingHorizontal: "6%",
  },
  headerButton: {
    width: 35,
    height: 35,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    width: 30,
    height: 30,
  },
  downloadButton: {
    width: 35,
    height: 35,
  },
  title:{
    fontSize: 22,
    fontWeight: 'bold',
    color: "#fff",
  },
  stick: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgb(231,107,35)',
    marginVertical: 10
  },
  userMessageBox: {
    maxWidth: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 15,
    marginVertical: 10,
  },
  userMessage: {
    maxWidth: '70%',
    height: 'auto',
    backgroundColor: 'rgb(20,22,30)',
    borderWidth: 2,
    borderColor: "rgb(79,28,121)",
    padding: 20,
    borderRadius: 15,
    borderBottomRightRadius: 5,
  },
  aiMessageBox: {
    maxWidth: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 15,
    marginVertical: 10,
  },
  aiMessage: {
    maxWidth: '85%',
    height: 'auto',
    backgroundColor: 'rgb(33,37,52)',
    padding: 20,
    borderRadius: 15,
    borderBottomLeftRadius: 5,
  },
  sendMessageBox: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: '5%'
  },
  input: {
    width: '100%',
    height: 40,
    borderRadius: 5,
    color: "white",
    paddingLeft: 10,
  },
  sendMessageButtonBox: {
    width: '100%',
    height: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
})
export default ResumeTalkScreen;
