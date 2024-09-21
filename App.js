import React, {useState} from 'react';
import {View, Image} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import LoginStartedScreen from './src/screens/LoginStartedScreen';
import LoginScreen from './src/screens/LoginScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import SignupScreen from './src/screens/SignupScreen';
import AIsScreen from './src/screens/AIsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import MessageHistoryScreen from './src/screens/MessageHistoryScreen';
import TalkScreen from './src/screens/TalkScreen';
import NewTalkScreen from './src/screens/newTalkScreen';
import ResumeTalkScreen from './src/screens/ResumeTalkScreen';
import ResumeMessageScreen from './src/screens/ResumeMessageScreen';
import Purchases from './src/screens/Purchases';
import ShareAndWin from './src/screens/ShareAndWin';
import CreditProcess from './src/screens/CreditProcess';
import BlogsScreen from './src/screens/BlogsScreen';
import BlogInfoScreen from './src/screens/BlogInfoScreen';
import PasswordResetCodeScreen from './src/screens/PasswordResetCodeScreen';
import PasswordChangeScreen from './src/screens/PasswordChangeScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: 'rgb(110,135,201)',
        tabBarStyle: {
          backgroundColor: "rgb(12,15,22)",
          borderTopWidth: 2,
          borderTopColor:  "rgb(19,24,36)",
        }
      }} >
      <Tab.Screen
        name={'SOHBETLERİM'}
        component={MessageHistoryScreen}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <View>
                <Image
                  source={require("./src/assets/images/chat.png")}
                  resizeMode="contain"
                  style={{ width: 25, height: 25 }}
                />
              </View>
            );
          },
        }}/>
      <Tab.Screen
        name={'AI EKİBİMİZ'}
        component={AIsScreen}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <View>
                <Image
                  source={require("./src/assets/images/aiImage.png")}
                  resizeMode="contain"
                  style={{ width: 25, height: 25 }}
                />
              </View>
            );
          },
        }}/>
      <Tab.Screen
        name={'PROFİL'}
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <View>
                <Image
                  source={require("./src/assets/images/profile.png")}
                  resizeMode="contain"
                  style={{ width: 25, height: 25 }}
                />
              </View>
            );
          },
        }}/>
    </Tab.Navigator>
  )
}

const App = () => {
  const [isLogined, setIsLogined] = useState( false);
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isLogined ? 'TabNavigator' : 'LoginStartedScreen'} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="TabNavigator" component={TabNavigator} />
        <Stack.Screen name="LoginStartedScreen" component={LoginStartedScreen} />
        <Stack.Screen
          name="LoginScreen"
          options={{ gestureEnabled: false}}
          component={LoginScreen}
          initialParams={{ setIsLogined: setIsLogined }}
        />
        <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
        <Stack.Screen name="SignupScreen" component={SignupScreen} />
        <Stack.Screen name="AIsScreen" component={AIsScreen} options={{ gestureEnabled: false }} />
        {/*gestureEnabled ile geri gitmeyi engelledik*/}
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="TalkScreen" component={TalkScreen} />
        <Stack.Screen name="NewTalkScreen" component={NewTalkScreen} />
        <Stack.Screen name="ResumeTalkScreen" component={ResumeTalkScreen} />
        <Stack.Screen name="ResumeMessageScreen" component={ResumeMessageScreen} />
        <Stack.Screen name="Purchases" component={Purchases} />
        <Stack.Screen name="ShareAndWin" component={ShareAndWin} />
        <Stack.Screen name="CreditProcess" component={CreditProcess} />
        <Stack.Screen name="BlogsScreen" component={BlogsScreen} />
        <Stack.Screen name="BlogInfoScreen" component={BlogInfoScreen} />
        <Stack.Screen name="PasswordResetCodeScreen" component={PasswordResetCodeScreen} />
        <Stack.Screen name="PasswordChangeScreen" component={PasswordChangeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
