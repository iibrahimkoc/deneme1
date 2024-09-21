import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
} from 'react-native';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

const TalkScreen = ({ navigation }) => {
  const selectedAI = storage.getString("selectedAI");
  const myToken = storage.getString("token");
  const selectedAiId = storage.getString("selectedAiId");

  const [responseData, setResponseData] = useState('');
  const [resumeResponseData, setResumeResponseData] = useState('');
  const [token, setToken] = useState(myToken);
  const [yes, setYes] = useState('');
  const [chat_id, setChatId] = useState('thread_66d57e4c6397c1.83564007');
  const [myMessage, setMyMessage] = useState('');
  const [newTalkDataJson, setNewTalkDataJson] = useState('');

  useEffect(() => {
      const newTalk = async () => {
        const newTalkFormData= new FormData();
        newTalkFormData.append("acces_token", token);
        newTalkFormData.append('ai_id', selectedAiId);

        try {
          const newTalkResponse = await fetch("https://aigency.dev/api/v1/newChat", {
            method: 'POST',
            body: newTalkFormData,
          })

          const newTalkData = newTalkResponse.json();
          setNewTalkDataJson(newTalkData);
          console.log(newTalkData);
          console.log(newTalkDataJson);
        }
        catch(error) {
          console.log(error);
        }
      }
    }, []
  )

  const sendMessage = async () => {
    setYes(myMessage);


    const sendFormData = new FormData();
    sendFormData.append('access_token', token);
    sendFormData.append('chat_id', chat_id);
    sendFormData.append('message', myMessage);

    const resumeFormData = new FormData();
    resumeFormData.append('access_token', token);
    resumeFormData.append('chat_id', chat_id);

    try{
      const sendResponse = await fetch("https://aigency.dev/api/v1/sendMessage", {
        method: 'POST',
        body: sendFormData,
      });

      const sendData = await sendResponse.json();
      setResponseData(sendData);


      const resumeResponse = await fetch("https://aigency.dev/api/v1/resumeChat/", {
        method: 'POST',
        body: resumeFormData,
      });

      const resumeData = await resumeResponse.json();
      setResumeResponseData(resumeData);
      console.log(resumeData);
    }
    catch (error) {
      console.log(error);
    }
  };



  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text>back</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>{selectedAI}</Text>
        <View style={styles.headerRight}><Text>Download</Text></View>
      </View>
      <View style={styles.stick}></View>
      <ScrollView>
        {resumeResponseData.length > 0 ? (
          resumeResponseData.map((item, index) => (
            <View key={index}>
              <View style={item.from === 'user' ? styles.userMessageBox : styles.aiMessageBox}>
                <View style={item.from === 'assistant' ? styles.userMessage : styles.aiMessage}>
                  <Text>{responseData?.answer?.message}</Text>
                </View>
              </View>
            </View>
          ))
          ):(
          <View style={styles.containerBox}><Text>d</Text></View>
          )}
        <View style={styles.userMessageBox}>
          <View style={styles.userMessage}><
            Text>{yes}</Text>
          </View>
        </View>
        <View style={styles.aiMessageBox}>
          <View style={styles.aiMessage}>
            <Text>{responseData?.answer?.message}</Text>
          </View>
        </View>
      </ScrollView>
      <View style={styles.stick}></View>
      <View style={styles.sendMessageBox}>
        <TextInput placeholder={'mesaj'}
                   style={styles.input}
                   value={myMessage}
                   onChangeText={(myMessage) => setMyMessage(myMessage)}></TextInput>
        <TouchableOpacity
          onPress={() => {
            console.log("bu gönderilecek mesaj: ", myMessage);
            sendMessage();
            setMyMessage(null)
          }}>
          <Text>gönder</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '5%',
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
    paddingHorizontal: 15
  },
  userMessage: {
    maxWidth: '70%',
    height: 'auto',
    backgroundColor: 'rgb(231,107,35)',
    padding: 20,
    borderRadius: 30,
    borderBottomRightRadius: 5,
  },
  aiMessageBox: {
    maxWidth: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 15
  },
  aiMessage: {
    maxWidth: '70%',
    height: 'auto',
    backgroundColor: 'rgb(218,107,218)',
    padding: 20,
    borderRadius: 30,
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
    width: '80%',
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
  }
})
export default TalkScreen;
