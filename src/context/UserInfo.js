import React, {useState, useEffect} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {MMKV} from 'react-native-mmkv';



const storage = new MMKV();

export const UserInfo = ({ setModalVisible, setSelectedAI, setSelectedAiId}) => {
  const [users, setUsers] = useState([]);
  const [aiCategory, setAiCategory] = useState([]);
  const token = storage.getString("token")
  const [loading, setLoading] = useState(true);

  const { width } = useWindowDimensions();

  useEffect(() => {
    (async () => {
      fetch("https://aigency.dev/api/v1/ai-team-list/?access_token="+ token)
        .then((resp) => resp.json())
        .then(json => {
          setUsers(json);
        })
        .finally(
          (e) => setLoading(false));

      fetch("https://aigency.dev/api/v1/ai-categories/?access_token=" + token)
        .then((resp) => resp.json())
        .then(json => {
          setAiCategory(json);
        })
        .finally((e) => setLoading(false))

    })();
}, [token]);

  const isLargeScreen = width > 600;

  return(
    <View style={{paddingTop: 20}}>
      {
        loading ? (
          <ActivityIndicator size="large" color={'#0d66ff'} />
        ) : (
          <FlatList
            data={users}
            renderItem={({item}) =>
              <View
                style={[styles.gridContainer, isLargeScreen && styles.gridContainerLarge]}
              >
                <TouchableOpacity style={[styles.box1, isLargeScreen ? styles.largeBox : styles.smallBox]}
                                  onPress={() => {
                                    console.log(users)
                                    setModalVisible(true)
                                    setSelectedAiId(item.ai_id)
                                    setSelectedAI(item.ai_name)
                                  }}
                >
                  <Image source={require("../assets/images/vip.png")} style={{width: 35,height: 35,position: 'absolute',right: 20,top: 0, display: item.is_vip ? "flex" : "none"}} resizeMode={'cover'} />
                  <View style={styles.photo}>
                    <Image resizeMethod={'auto'} source={{uri: "https://aigency.dev/public_uploads/66731bda984b7.jpg"}} style={styles.photoImage}></Image>
                  </View>
                  <View style={styles.stick}></View>
                  <View style={styles.aiTextBox}>
                    <View style={styles.aiInfoHeaderBox}>
                      <Text style={styles.aiInfoHeader}>{String(item.ai_name).toUpperCase()}</Text>
                    </View>
                    <View style={styles.aiInfoTextBox}>
                      <Text numberOfLines={3} style={styles.aiInfoText}>{item.ai_desc}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            }/>
        )
            }
    </View>
  )

}

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    display: 'flex',
    alignItems: 'center',
  },
  gridContainerLarge: {
    flexDirection: "row",
    flexWrap: 'wrap',
    paddingHorizontal: '5%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  box1: {
    marginHorizontal: '5%',
    width: '90%',
    paddingVertical: '5%',
    height: 150,
    borderWidth: 2,
    borderColor: "rgb(34,42,63)",
    backgroundColor: "rgb(19,24,36)",
    marginBottom: 15,
    borderRadius: 10,
    alignItems: 'center',
    paddingHorizontal: 10,
    flexDirection: 'row',
  },
  photo: {
    height: '100%',
    width: '30%',

  },
  photoImage: {
    height: '100%',
    width: '100%',
    borderRadius: 200,
  },
  stick: {
    height: '90%',
    borderRightWidth: 2,
    borderColor: "rgb(132,138,175)",
    marginHorizontal: 10,
  },
  aiTextBox: {
    width: '60%',

  },
  aiInfoHeaderBox: {
    width: '100%',
    height: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  aiInfoHeader: {
    fontWeight: 'bold',
    color: '#fff',
  },
  aiInfoTextBox: {
    height: 70,
    justifyContent: 'center',
  },
  aiInfoText: {
    color: "#fff",
  },

});
