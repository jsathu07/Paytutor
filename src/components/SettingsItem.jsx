import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Icon } from '@rneui/base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { color, font } from '../utils/theme';

const SettingsItem = ({ text, onPress, text1, primary, secondary, name }) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={styles.selector}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Icon type="ionicon" name={name} size={wp("7%")} color={primary} />
                    <View>
                        <Text style={[styles.selectorText, { color: primary }]}>{text}</Text>
                        <Text style={[styles.selectorText1, { color: secondary }]}>{text1}</Text>
                    </View>
                </View>
                <Icon type="ionicon" name="chevron-forward-circle-outline" size={wp("7%")} color={primary} />
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    selector: {
        marginTop: hp("2%"),
        flexDirection: "row",
        justifyContent: "space-between",
        alignSelf: "center",
        width: wp("90%"),
        borderRadius: 12,
        alignItems: "center",
        backgroundColor: color.white1,
        padding: wp("5%")
    },
    selectorText: {
        fontSize: wp("4%"),
        color: color.red1,
        fontFamily: font.semibold,
        marginLeft: wp("5%"),
        width: wp("60%")
    },
    selectorText1: {
        fontSize: wp("3.5%"),
        color: color.red1,
        fontFamily: font.semibold,
        marginLeft: wp("5%"),
        width: wp("60%")
    },
})

export default SettingsItem;