import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import UserAvatar from 'react-native-user-avatar';
import { Icon } from '@rneui/base';
import { color, font, scheme } from "../utils/theme";

const TransItem = ({ onLongPress = () => null, style = {}, name, value = "", date, isMoney, onPress, text = "", text1 = null, isUser = false }) => {
    return (
        <TouchableOpacity onPress={onPress} onLongPress={onLongPress}>
            <View style={[styles.itemContainer, style]}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <UserAvatar bgColors={scheme} size={wp("10%")} name={name} />
                    <View style={{ marginLeft: wp("5%") }}>
                        <Text style={styles.innerTitle}>{name}</Text>
                        <Text style={styles.innerTitleTwo}>{date}</Text>
                        {
                            isUser &&
                            (
                                <View style={{ flexDirection: "row", marginTop: hp("1%"), alignItems: "center" }}>
                                    <Icon name="people-circle-outline" type="ionicon" size={wp("5%")} color={color.black0} />
                                    <Text style={styles.user}>  {value}  student(s)</Text>
                                </View>
                            )
                        }
                        {
                            text !== "" &&
                            (
                                <Text style={styles.innerTitleTwo}>{text}</Text>
                            )
                        }
                        {
                            text1 !== null &&
                            (
                                <Text style={styles.innerTitleTwo}>Last paid {new Date(text1).getMonth() + 1} / {new Date(text1).getFullYear()}</Text>
                            )
                        }
                    </View>
                </View>
                {
                    isMoney &&
                    (
                        <Text style={styles.money}>{value}</Text>
                    )
                }
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
        marginTop: hp("1.5%"),
        alignSelf: "center"
    },
    innerTitle: {
        fontSize: wp("4%"),
        color: color.black0,
        fontFamily: font.semibold,
        width: wp("40%"),
    },
    innerTitleTwo: {
        fontSize: wp("3.5%"),
        color: color.grey0,
        fontFamily: font.semibold,
        marginTop: hp("1%"),
        width: wp("40%"),
    },
    money: {
        fontSize: wp("4%"),
        color: color.black0,
        fontFamily: font.semibold,
        width: wp("20%"),
    },
    user: {
        fontSize: wp("3.5%"),
        color: color.black0,
        fontFamily: font.semibold,
        width: wp("40%"),
    }
})

export default TransItem;

// src="https://scontent.fcmb2-2.fna.fbcdn.net/v/t39.30808-1/300880677_474158454721637_9026610335686304816_n.jpg?stp=cp0_dst-jpg_e15_p120x120_q65&_nc_cat=100&ccb=1-7&_nc_sid=dbb9e7&_nc_ohc=Vcfc306jTXgAX-5AVPh&_nc_ht=scontent.fcmb2-2.fna&oh=00_AfALZ-QNs8uMPWu1-OI-OBaF1WaZvxjiNutQCr2jYdDt1A&oe=64BBD946"