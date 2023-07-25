import { StyleSheet, View } from 'react-native';
import { CheckBox } from '@rneui/base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { color, font } from "../utils/theme";

const CustomCheckBox = ({ text, checked, onPress }) => {
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
        </View>
    )
}

const styles = StyleSheet.create({
    checkboxContainer: {
        padding: 0,
        marginLeft: wp("7%"),
        marginTop: hp("5%")
    },
    checkboxText: {
        fontFamily: font.bold,
        fontSize: wp("4%"),
        fontWeight: "normal",
        lineHeight: 15,
        marginLeft: wp("5%")
    }
})

export default CustomCheckBox;