import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  Linking
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {MMKV} from 'react-native-mmkv';

const storage = new MMKV()
const CreditProcess = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const token = storage.getString("token")
  const [packageInfo, setPackageInfo] = useState([])

  const pricingList = async () => {
    try{
      const pricingListResponse = await fetch("https://aigency.dev/api/v1/pricing-list?access_token="+token,{
        method: 'GET',
      })
      const pricingListData = await pricingListResponse.json();
      console.log(pricingListData)
      setPackageInfo(pricingListData);
    }
    catch(error){
      console.log(error)
    }
  }

  const linkingUrl = () => {
    const url = "https://aigency.dev/pricing";
    Linking.openURL(url).catch((error) => {console.log("hata: ",error);});
  }

  useEffect(() => {
    pricingList()
  }, [token])

  const isLargeScreen = width > 600;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require("../assets/images/arrowBack.png")} style={styles.headerIcon}></Image>
        </TouchableOpacity>
        <Text style={styles.headerText}>PAKETLER</Text>
        <View style={styles.headerIcon}></View>
      </View>
      <LinearGradient colors={['rgb(184,86,196)', 'rgb(121,119,243)']}
                      start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }}
                      style={{width: "100%", height: 2}} />
      <ScrollView>
        <View
          style={[styles.gridContainer, isLargeScreen && styles.gridContainerLarge]}
        >
          {packageInfo.length > 0 ? (
            packageInfo.map((item, index) => {
              return (
                <View
                  key={index}
                  style={[styles.packageBox, isLargeScreen ? styles.largeBox : styles.smallBox]}>

                  <View>
                    <View style={styles.packageBoxHeader}>
                      <Image style={styles.packageBoxImage} source={require("../assets/images/aiImage.png")} />
                      <Text style={styles.packageBoxName}>{item.package_name}</Text>
                      <Text style={styles.packageBoxPrice}>{item.package_price}</Text>
                    </View>
                    <View style={styles.stick}></View>
                    <View>
                      {
                        item.package_features.map((item2, index2) => {
                          return(
                            <View key={index2} style={styles.packageBoxInfoBox}>
                              <Image style={styles.packageBoxIcon} source={require("../assets/images/star.png")}/>
                              <Text style={styles.packageBoxText}>{item2}</Text>
                            </View>
                          )
                        })
                      }
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => linkingUrl()}>
                    <LinearGradient colors={['rgb(184,86,196)', 'rgb(121,119,243)']}
                                    start={{ x: 0.4, y: 0.5 }} end={{ x: 1.0, y: 1.0 }}
                                    style={styles.packageBoxButton}>
                      <Text style={styles.packageBoxInfoBoxText}>SATIN AL</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              )
            })
          ): (
            <Text style={styles.container}>bekle</Text>
          )}
        </View>
      </ScrollView>
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
  },
  headerText: {
    fontSize: 22,
    color: "#fff",
    fontWeight: 'bold',
  },
  headerIcon: {
    width: 30,
    height: 30,
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
    alignItems: "stretch",
    paddingTop: 20,
  },
  packageBox: {
    paddingVertical: 15 ,
    borderWidth: 2,
    borderColor: "rgb(34,42,63)",
    backgroundColor: "rgb(19,24,36)",
    marginBottom: 15,
    borderRadius: 10,
    paddingHorizontal: 15,
    display:"flex",
    justifyContent: "space-between",
  },
  smallBox: {
    width: '90%',
    marginHorizontal: "5%"
  },
  largeBox:{
    width: '48%',
  },
  packageBoxHeader: {
    flexDirection: "column",
    alignItems: "center",
  },
  packageBoxImage: {
    height: 70,
    aspectRatio: 1,
    resizeMode: "contain",
  },
  packageBoxName: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    marginVertical: 10,
  },
  packageBoxPrice: {
    fontSize: 30,
    color: "#fff",
    fontWeight: "bold",
  },
  stick: {
    width: '100%',
    backgroundColor: "rgb(34,36,41)",
    height: 2,
    marginVertical: 15,
  },
  packageBoxInfoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  packageBoxIcon: {
    width: 20,
    aspectRatio: 1,
    resizeMode: "contain",
    marginRight: 10,
  },
  packageBoxText: {
    fontSize: 16,
    color: "#fff",
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
  }
})
export default CreditProcess;
