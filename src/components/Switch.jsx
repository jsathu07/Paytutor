import { StyleSheet, View, Text } from 'react-native';
import { Switch } from '@rneui/base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { color, font } from '../utils/theme'

const CustomSwitch = ({ value, onValueChange }) => {
    return (
        <View style={styles.selector}>
            <Text style={styles.selectorText}>AI automated review response</Text>
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
        width: wp("85%"),
        alignItems: "center"
    },
    selectorText: {
        fontSize: wp("4%"),
        color: color.black0,
        fontFamily: font.semibold
    },
})

export default CustomSwitch;