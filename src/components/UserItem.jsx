import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import UserAvatar from 'react-native-user-avatar';
import { color, font, scheme } from "../utils/theme";

const UserItem = ({ name, status }) => {
    return (
        <TouchableOpacity>
            <View style={styles.itemContainer}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <UserAvatar bgColors={scheme} size={wp("10%")} name={name} />
                    <Text style={styles.innerTitle}>{name}</Text>
                </View>
                <View style={[styles.paid, { backgroundColor: status ? color.green0 : color.red0 }]}>
                    <Text style={[styles.paidText, { color: status ? color.green1 : color.red1 }]}>{status ? "Paid" : "Due"}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    itemContainer: {
        width: wp("90%"),
        borderRadius: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: wp("4%"),
        backgroundColor: color.white1,
        marginTop: hp("1%"),
        alignSelf: "center"
    },
    innerTitle: {
        fontSize: wp("4%"),
        color: color.black0,
        fontFamily: font.semibold,
        marginLeft: wp("5%"),
        width: wp("40%")
    },
    paid: {
        width: wp("20%"),
        height: wp("10%"),
        borderRadius: 20,
        backgroundColor: color.green0,
        justifyContent: "center",
        alignItems: "center"
    },
    paidText: {
        fontSize: wp("4%"),
        color: color.green1,
        fontFamily: font.bold,
    }
})

export default UserItem;