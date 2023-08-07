import { StyleSheet, View, Text } from 'react-native';
import { Switch, Icon } from '@rneui/base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { color, font } from '../utils/theme';

const CustomSwitch = ({ value, onValueChange, text, text1 }) => {
    return (
        <View style={styles.selector}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Icon type="material" name="send" size={wp("7%")} color={color.black0} />
                <View>
                    <Text style={styles.selectorText}>{text}</Text>
                    <Text style={styles.selectorText1}>{text1}</Text>
                </View>
            </View>
            <Switch
                value={value}
                color={color.blue0}
                thumbColor={color.white0}
                onValueChange={onValueChange}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    selector: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: wp("90%"),
        alignItems: "center",
        alignSelf: "center",
        marginTop: hp("2%"),
        borderRadius: 12,
        backgroundColor: color.white1,
        padding: wp("5%")
    },
    selectorText: {
        fontSize: wp("4%"),
        color: color.black0,
        fontFamily: font.semibold,
        marginLeft: wp("5%")
    },
    selectorText1: {
        fontSize: wp("3.5%"),
        color: color.grey0,
        fontFamily: font.semibold,
        marginLeft: wp("5%")
    },
})

export default CustomSwitch;