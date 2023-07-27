import { useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, ScrollView, StatusBar, Linking } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import auth from '@react-native-firebase/auth';
import Switch from '../../components/Switch';
import SettingsItem from '../../components/SettingsItem';
import { color, font } from '../../utils/theme';
import Money from '../../components/Money';

const SettingsScreen = () => {

    const [checked, setChecked] = useState(true);

    const signOut = async () => {
        await auth().signOut();
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>

                <Text style={styles.mainTitle}>Settings</Text>

                <Money text1={0} text2={0} text3={0} text4={"2022/07"} />

                <View style={{ marginTop: hp("1%") }}>
                    <Switch text="Send SMS" text1="Messages for transactions" value={checked} onValueChange={() => { setChecked(!checked) }} />

                    <SettingsItem name="card-outline" primary={color.black0} secondary={color.grey0} text="Pay balance" text1="Make remaining payment" onPress={() => { }} />

                    <SettingsItem name="information-circle-outline" primary={color.black0} secondary={color.grey0} text="Contact support" text1="Press to contact customer support" onPress={() => { Linking.openURL("https://api.whatsapp.com/send?text=&phone=+94762206823") }} />

                    <SettingsItem name="trash-bin-outline" primary={color.red1} secondary={color.red1} text="Sign Out" text1="Sign out from your account" onPress={signOut} />
                </View>

                <StatusBar backgroundColor={color.blue0} />

            </ScrollView>
        </SafeAreaView>
    )
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