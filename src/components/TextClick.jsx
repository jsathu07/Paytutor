import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { color, font } from "../utils/theme"

const TextClick = ({ text1, text2, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: hp("4%"), width: wp("70%"), alignSelf: "center" }}>
                <Text style={styles.lastTextOne}>{text1}</Text>
                <Text style={styles.lastTextTwo}>{text2}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    lastTextOne: {
        fontFamily: font.semibold,
        fontSize: wp("4%"),
        color: color.grey0
    },
    lastTextTwo: {
        fontFamily: font.semibold,
        fontSize: wp("4%"),
        color: color.blue0,
    }
})

export default TextClick;