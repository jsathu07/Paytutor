import { StyleSheet, View, Text } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon } from '@rneui/base';
import { color, font } from "../utils/theme";

const TransMoney = ({ text1, status }) => {
    return (
        <View style={styles.mainContainer}>
            <Icon style={{ alignSelf: "flex-start" }} name="cash-outline" type="ionicon" size={wp("7%")} />
            <View style={styles.subContainer}>
                <View style={{ width: wp("40%"), alignSelf: "flex-start" }}>
                    <Text style={styles.title0}>Total money</Text>
                    <Text style={styles.title1}>Rs. {text1}</Text>
                </View>
                <View style={[styles.paid, { backgroundColor: status ? color.green0 : color.red0 }]}>
                    <Text style={[styles.paidText, { color: status ? color.green1 : color.red1 }]}>{status ? "+ 0%" : "- 0%"}</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        marginTop: hp("2%"),
        alignSelf: "center",
        backgroundColor: color.white1,
        padding: wp("5%"),
        width: wp("90%"),
        borderRadius: 12
    },
    subContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: hp("2%"),
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
    paid: {
        backgroundColor: color.green0,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
        alignSelf: "flex-end",
        padding: wp("3%")
    },
    paidText: {
        fontSize: wp("4%"),
        color: color.green1,
        fontFamily: font.bold,
    }
})

export default TransMoney;