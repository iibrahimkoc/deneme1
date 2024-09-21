import React, {useState,useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView, FlatList,
} from 'react-native';
import {MMKV} from 'react-native-mmkv';
import LinearGradient from 'react-native-linear-gradient';

const storage = new MMKV();

const Purchases = ({ navigation }) => {

  const [purchases, setPurchases] = useState([]);
  const token = storage.getString('token');
  useEffect(() => {
    const getPurchases = async () => {
      try {
        const purchasesResponse = await fetch("https://aigency.dev/api/v1/my-purchases?access_token=" + token, {
          method: 'GET',
        })
        const purchasesData = await purchasesResponse.json();
        setPurchases(purchasesData);
      }
      catch (error) {
        console.log(error);
      }
    }
    getPurchases()
  }, [token]);

  useEffect(() => {
    console.log("Güncellenmiş veri:", purchases);
  }, [purchases]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton}
                          onPress={() => {
                            navigation.goBack();
                          }}>
          <Image source={require('../assets/images/arrowBack.png')} style={styles.headerIcon}/>
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>SATIN ALIMLARIM</Text>
        </View>
        <TouchableOpacity style={styles.headerButton}
                          onPress={() => {
                            navigation.navigate('CreditProcess');
                          }}
        >
          <Image source={require('../assets/images/shoppingCart.png')} style={styles.headerIcon}/>
        </TouchableOpacity>
      </View>

      <LinearGradient colors={['rgb(184,86,196)', 'rgb(121,119,243)']}
                      start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }}
                      style={{width: "100%", height: 2}} />

      <ScrollView showsVerticalScrollIndicator={false} style={styles.aiBox}>
        <FlatList
          data={purchases}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.box}>
              <View style={styles.purchasesHeaderBox}>
                <Text style={styles.purchasesHeader}>{item.product_name}</Text>
                <View style={[styles.purchasesStatusBox,item.status_text ==="Ödeme Onaylandı" ? { backgroundColor: "rgb(17,135,48)"} : {backgroundColor: "rgb(184,0,0)"}]}>
                  <Text style={styles.purchasesStatus}>{item.status_text}</Text>
                </View>
              </View>
              <Text style={styles.purchasesCredits}><Text style={styles.boldText}>Krediler: </Text>{item.credits} Kredi</Text>
              <Text style={styles.purchasesPaymentMethod}><Text style={styles.boldText}>Ödeme Yöntemi: </Text>{item.payment_method === "bank_deposit" ? "Banka Havalesi" : item.payment_method === "paytr" ? "PayTR" : "Tanımsız Ödeme"}</Text>
              <Text style={styles.purchasesPrice}><Text style={styles.boldText}>Fiyat: </Text>{item.price}</Text>
            </View>
          )}
        />
      </ScrollView>
    </SafeAreaView>
  )
};

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
    backgroundColor: "rgb(12,15,22)",
  },
  headerIcon: {
    width: 30,
    height: 30,
  },
  title:{
    fontSize: 22,
    fontWeight: 'bold',
    color: "#fff",
  },
  headerButton: {
    width: 30,
    height: 30,
  },
  aiBox: {
    width: '100%',
    paddingTop: 20,
    backgroundColor: "rgb(12,15,22)",
  },
  box: {
    marginHorizontal: '5%',
    width: '90%',
    paddingVertical: 15,
    height:"auto",
    borderWidth: 2,
    borderColor: "rgb(34,42,63)",
    backgroundColor: "rgb(19,24,36)",
    marginBottom: 15,
    borderRadius: 10,
    paddingHorizontal: 15,
  },
  purchasesHeaderBox: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

  },
  purchasesHeader: {
    color: "white",
    fontSize: 23,
    fontWeight: 'bold',
  },
  purchasesStatusBox:{
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
  },
  purchasesStatus: {
    color: "white",
  },
  boldText:{
    fontWeight: 'bold',
  },
  purchasesCredits:{
    color: "white",
    marginTop: 15,
    fontSize: 15,
  },
  purchasesPaymentMethod:{
    color: "white",
    fontSize: 15,
    marginVertical: 7,
  },
  purchasesPrice:{
    color: "white",
    fontSize: 15,
  }
})

export default Purchases;
