import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Icon } from '@rneui/base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { color, font } from "../utils/theme";

const NavBar = ({ text, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={styles.container}>
                <Icon size={wp("8%")} color={color.blue0} type="ionicon" name="chevron-back-outline" />
                <Text style={styles.text}>{text}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: hp("2%"),
        alignSelf: "flex-start",
        marginLeft: wp("3%"),
        flexDirection: "row",
        alignItems: "center"
    },
    text: {
        fontFamily: font.semibold,
        fontSize: wp("4%"),
        color: color.blue0,
        marginLeft: wp("2%"),
    },
})

export default NavBar;