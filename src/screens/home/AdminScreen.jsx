import { SafeAreaView, StyleSheet, View, Text, StatusBar } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { color, font } from '../../utils/theme';

const AdminScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.text0}>Contact your organization owner</Text>
            <StatusBar backgroundColor={color.blue0} />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.white0,
        justifyContent: "center",
        alignItems: "center"
    },
    text0: {
        fontFamily: font.semibold,
        fontSize: wp("4%"),
        color: color.black0,
    }
});

export default AdminScreen;

