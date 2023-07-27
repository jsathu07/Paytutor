import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SignUpScreen from './src/screens/auth/SignUpScreen';
import SignInScreen from './src/screens/auth/SignInScreen';
import MainScreen from './src/screens/home/MainScreen';
import PaymentScreen from './src/screens/home/PaymentScreen';
import ClassRegisterScreen from './src/screens/home/ClassRegisterScreen';
import ClassDetailScreen from './src/screens/home/ClassDetailScreen';
import TransactionScreen from './src/screens/home/TransactionScreen';
import CustomPaymentScreen from './src/screens/home/CustomPaymentScreen';

import { color, font } from './src/utils/theme';
import { View } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import DropdownAlert from 'react-native-dropdownalert';
import DropDownHolder from './src/utils/Dropdown';
import SplashScreen from 'react-native-splash-screen';

import { Provider } from 'react-redux';
import store from './src/store/store';
import auth from '@react-native-firebase/auth';
import codePush from "react-native-code-push";

const Stack = createNativeStackNavigator();

const App = () => {

  const [user, setUser] = useState(null);

  const handleAuth = (user) => {
    if (user !== null) {
      setUser(user);
    } else {
      setUser(null);
    }
  }

  useEffect(() => {
    SplashScreen.hide();
    const subscriber = auth().onAuthStateChanged(handleAuth);
    return subscriber;
  }, [])

  if (user === null) {
    return (
      <Provider store={store}>
        <View style={{ flex: 1 }}>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="SignIn">
              <Stack.Screen name="SignIn" component={SignInScreen} />
              <Stack.Screen name="SignUp" component={SignUpScreen} />
            </Stack.Navigator>
          </NavigationContainer>
          <DropdownAlert
            closeInterval={1000}
            titleStyle={{ fontFamily: font.semibold, fontSize: wp("5%"), color: color.white0 }}
            messageStyle={{ fontFamily: font.regular, fontSize: wp("4%"), color: color.white0 }}
            ref={(ref) => DropDownHolder.setDropDown(ref)}
          />
        </View>
      </Provider>)
  } else {
    return (
      <Provider store={store}>
        <View style={{ flex: 1 }}>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Main">
              <Stack.Screen name="Main" component={MainScreen} />
              <Stack.Screen name="Payment" component={PaymentScreen} />
              <Stack.Screen name="ClassRegister" component={ClassRegisterScreen} />
              <Stack.Screen name="ClassDetail" component={ClassDetailScreen} />
              <Stack.Screen name="Transaction" component={TransactionScreen} />
              <Stack.Screen name="CustomPayment" component={CustomPaymentScreen} />
            </Stack.Navigator>
          </NavigationContainer>
          <DropdownAlert
            closeInterval={1000}
            titleStyle={{ fontFamily: font.semibold, fontSize: wp("5%"), color: color.white0 }}
            messageStyle={{ fontFamily: font.regular, fontSize: wp("4%"), color: color.white0 }}
            ref={(ref) => DropDownHolder.setDropDown(ref)}
          />
        </View>
      </Provider>
    )
  }
}

export default codePush(App);