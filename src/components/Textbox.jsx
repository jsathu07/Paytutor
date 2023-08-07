import { StyleSheet, View, Text } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { color, font } from '../utils'

const CustomTextBox = ({ text1, text2 }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title0}>{text1}</Text>
            <Text style={styles.title1}>{text2}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: wp("85%"),
        backgroundColor: color.white0,
        borderRadius: 10,
        borderColor: color.grey1,
        borderWidth: wp("0.5%"),
        padding: wp("4%"),
        justifyContent: "center",
        alignSelf: "center",
        margin: hp("1%")
    },
    title0: {
        fontSize: wp("4%"),
        color: color.grey0,
        fontFamily: font.semibold
    },
    title1: {
        fontSize: wp("4%"),
        color: color.black0,
        fontFamily: font.bold,
        marginTop: hp("1.5%"),
    }
})

export default CustomTextBox;