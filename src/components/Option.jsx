import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Icon } from '@rneui/base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { color, font } from '../utils/theme'

const Option = ({ checked, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={styles.selector}>
                <Text style={styles.selectorText}>Upload organization logo</Text>
                {
                    checked ?
                        (
                            <Icon color={color.blue0} name="checkmark-circle-outline" type="ionicon" size={wp("7%")} />
                        )
                        :
                        (
                            <Icon color={color.grey0} name="image-outline" type="ionicon" size={wp("7%")} />
                        )
                }
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    selector: {
        marginTop: hp("1%"),
        flexDirection: "row",
        justifyContent: "space-between",
        alignSelf: "center",
        width: wp("85%"),
        alignItems: "center",
        borderWidth: 2,
        borderBottomWidth: 2,
        borderColor: color.grey1,
        borderRadius: 12,
        padding: wp("3.5%")
    },
    selectorText: {
        fontSize: wp("4%"),
        color: color.grey0,
        fontFamily: font.semibold
    },
})

export default Option;