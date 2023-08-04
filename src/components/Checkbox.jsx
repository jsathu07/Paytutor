import { StyleSheet, View } from 'react-native';
import { CheckBox } from '@rneui/base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { color, font } from "../utils/theme";
import { TouchableOpacity } from 'react-native-gesture-handler';

const CustomCheckBox = ({ text, checked, onPress, isLink = false, onLinkPress = () => null }) => {
    return (
        <View>
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
    checkboxContainer: {
        padding: wp("4%"),
        paddingLeft: 0,
        width: wp("85%"),
        alignSelf: "center",
        marginTop: hp("3%"),
        marginBottom: hp("4%")
    },
    checkboxText: {
        fontFamily: font.bold,
        fontSize: wp("4%"),
        fontWeight: "normal",
        lineHeight: 15,
        marginLeft: wp("5%")
    },
    text: {
        fontFamily: font.semibold,
        fontSize: wp("4%"),
        color: color.blue0,
        marginLeft: wp("5%")
    }
})

export default CustomCheckBox;