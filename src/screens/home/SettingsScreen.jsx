import { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, ScrollView, StatusBar, Linking } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Switch from '../../components/Switch';
import SettingsItem from '../../components/SettingsItem';
import { color, font } from '../../utils/theme';
import Money from '../../components/Money';
import { useSelector } from "react-redux";
import Loader from '../../components/Loader';
import Button from '../../components/Button';
import functions from '@react-native-firebase/functions';

const SettingsScreen = () => {

    const [isLoading, setIsLoading] = useState(false);

    const userData = useSelector((state) => state.user.data);

    const signOut = async () => {
        await auth().signOut();
    }

    const setSmsStatus = async () => {
        setIsLoading(true);
        await firestore().collection("User").doc(userData.uid)
            .update({
                isSmsEnabled: !userData.isSmsEnabled
            })
        setIsLoading(false);
    }

    useEffect(() => {
        console.log(userData?.isAdmin);
    }, [userData])

    if (isLoading) {
        return (
            <Loader />
        )
    } else {
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView>

                    <Text style={styles.mainTitle}>Settings</Text>

                    <Money text1={userData.transCount * 10} text2={userData.msgCount} text3={userData.transCount} text4={userData.lastPayment} />

                    <View style={{ marginTop: hp("1%") }}>
                        <Switch text="Send SMS" text1="Messages for transactions" value={userData.isSmsEnabled} onValueChange={setSmsStatus} />

                        <SettingsItem name="mail-outline" primary={color.black0} secondary={color.grey0} text="Reload SMS" text1="Top up SMS balance" onPress={() => { }} />

                        <SettingsItem name="card-outline" primary={color.black0} secondary={color.grey0} text="Pay subscription fee" text1="Make remaining payment" onPress={() => { }} />

                        <SettingsItem name="information-circle-outline" primary={color.black0} secondary={color.grey0} text="Contact support" text1="Press to contact customer support" onPress={() => { Linking.openURL("https://api.whatsapp.com/send?text=&phone=+94762206823") }} />

                        <SettingsItem name="trash-bin-outline" primary={color.red1} secondary={color.red1} text="Sign Out" text1="Sign out from your account" onPress={signOut} />
                    </View>

                    {/* <Button text="press me" onPress={() => {
                        functions().httpsCallable('addAdmin')({ email: "mesathu3m@gmail.com", userData })
                            .then((e) => { console.log(e) })
                            .catch((e) => { console.log(e) })
                    }} /> */}

                    <View style={{ height: hp("5%") }}></View>

                    <StatusBar backgroundColor={color.blue0} />

                </ScrollView>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.white0
    },
    mainTitle: {
        fontFamily: font.bold,
        fontSize: wp("5%"),
        color: color.black0,
        marginLeft: wp("4%"),
        marginTop: hp("5%"),
        marginBottom: hp("2%")
    },
})

export default SettingsScreen;