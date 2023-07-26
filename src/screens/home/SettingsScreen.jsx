import { useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, ScrollView, StatusBar } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Switch from '../../components/Switch';
import SettingsItem from '../../components/SettingsItem';
import { color, font } from '../../utils/theme';

const SettingsScreen = () => {

    const [checked, setChecked] = useState(true);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>

                <Text style={styles.mainTitle}>Settings</Text>

                <Switch text="Send SMS" text1="Messages for transactions" value={checked} onValueChange={() => { setChecked(!checked) }} />

                <SettingsItem name="card-outline" primary={color.black0} secondary={color.grey0} text="Pay balance" text1="Make remaining payment" onPress={() => { }} />

                <SettingsItem name="information-circle-outline" primary={color.black0} secondary={color.grey0} text="Contact support" text1="Press to contact customer support" onPress={() => { }} />

                <SettingsItem name="trash-bin-outline" primary={color.red1} secondary={color.red1} text="Sign Out" text1="Log-out from your account" onPress={() => { }} />

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
        fontFamily: font.semibold,
        fontSize: wp("5%"),
        color: color.black0,
        marginLeft: wp("4%"),
        marginTop: hp("5%"),
        marginBottom: hp("2%")
    },
})

export default SettingsScreen;