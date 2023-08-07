import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { CheckBox } from '@rneui/base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { color, font } from "../utils/theme";

const CustomCheckBox = ({ text, checked, onPress, isLink = false, onLinkPress = () => null }) => {
    return (
        <View style={styles.container}>
            <CheckBox
                title={text}
                containerStyle={styles.checkboxContainer}
                textStyle={styles.checkboxText}
                iconType="ionicon"
                checkedIcon="checkbox"
                uncheckedIcon="checkbox-outline"
                checkedColor={color.blue0}
                uncheckedColor={color.grey0}
                checked={checked}
                onPress={onPress}
            />
            {
                isLink && (
                    <TouchableOpacity onPress={onLinkPress}>
                        <Text style={styles.text}>View</Text>
                    </TouchableOpacity>
                )
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignSelf: "center",
        marginTop: hp("4%"),
        marginBottom: hp("5%"),
        alignItems: "center",
        width: wp("85%"),
    },
    checkboxContainer: {
        paddingLeft: 0,
        width: wp("70%"),
        margin: 0,
        marginLeft: 0,
        marginRight: 0,
    },
    checkboxText: {
        fontFamily: font.bold,
        fontSize: wp("4%"),
        fontWeight: "normal",
        lineHeight: 15,
        marginLeft: wp("5%")
    },
    text: {
        fontFamily: font.bold,
        fontSize: wp("4%"),
        color: color.blue0,
        lineHeight: 15,
        marginLeft: wp("3%"),
    }
})

export default CustomCheckBox;