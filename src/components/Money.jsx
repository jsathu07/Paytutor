import { StyleSheet, View, Text } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { color, font } from "../utils/theme";

const Money = ({ text1, text2, text3, text4 }) => {
    return (
        <View style={styles.mainContainer}>
            <View style={{ width: wp("40%"), alignSelf: "flex-start" }}>
                <Text style={styles.title0}>Pending balance</Text>
                <Text style={styles.title1}>Rs. {text1}</Text>
                <Text style={styles.title2}>Last paid {text4}</Text>
            </View>
            <View style={{ width: wp("30%") }}>
                <View>
                    <Text style={styles.innerTitle0}>{'\u2B24'}  SMS</Text>
                    <Text style={styles.innerTitle1}>{text2}</Text>
                </View>
                <View style={{ marginTop: hp("2%") }}>
                    <Text style={[styles.innerTitle0, { color: color.orange0 }]}>{'\u2B24'}  Subscription</Text>
                    <Text style={styles.innerTitle1}>{text3}</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: hp("2%"),
        alignSelf: "center",
        backgroundColor: color.white1,
        padding: wp("5%"),
        width: wp("90%"),
        borderRadius: 12
    },
    title0: {
        fontSize: wp("4%"),
        color: color.grey0,
        fontFamily: font.semibold,
    },
    title1: {
        fontSize: wp("7%"),
        color: color.black0,
        fontFamily: font.bold,
        marginTop: hp("1%")
    },
    title2: {
        fontSize: wp("3.5%"),
        color: color.grey0,
        fontFamily: font.semibold,
        marginTop: hp("3%")
    },
    innerTitle0: {
        fontSize: wp("3.5%"),
        color: color.blue0,
        fontFamily: font.semibold,
    },
    innerTitle1: {
        fontSize: wp("4%"),
        color: color.black0,
        fontFamily: font.bold,
        marginTop: hp("1%")
    }
})

export default Money;