import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView} from 'react-native';

const NotificationScreen = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerLeft} onPress={() => navigation.goBack()}>
          <Text style={styles.headerText}>anne</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>BİLDİRİMLER</Text>
        </View>
        <TouchableOpacity style={styles.headerRight}>
          <Text style={styles.headerText}>anne</Text>
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
    width: '100%',
    height: 50,
    alignItems: 'center',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title:{
    fontSize: 22,
    fontWeight: 'bold',
  },
})
export default NotificationScreen;
