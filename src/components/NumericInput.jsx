import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Icon } from '@rneui/base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { color, font } from '../utils/theme'

const NumericInput = ({ onPlusPress, onMinusPlus, value }) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={onPlusPress}>
                <Icon type="ionicon" name="add-circle-outline" color={color.grey0} size={wp("7%")} />
            </TouchableOpacity>
            <Text style={styles.text}>{value}</Text>
            <TouchableOpacity onPress={onMinusPlus}>
                <Icon type="ionicon" name="remove-circle-outline" color={color.grey0} size={wp("7%")} />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        alignSelf: "center",
        width: wp("85%"),
        borderRadius: 12,
        padding: wp("4%"),
        marginTop: hp("3%"),
        backgroundColor: color.white0
    },
    text: {
        fontSize: wp("5%"),
        color: color.black0,
        fontFamily: font.semibold,
    }
})

export default NumericInput;