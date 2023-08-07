import { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { color, font } from "../utils/theme";
import { Icon } from '@rneui/base';
import DatePicker from 'react-native-date-picker'

const CustomDatePicker = ({ value, onConfirm }) => {

    const [open, setOpen] = useState(false);

    return (
        <TouchableOpacity onPress={() => { setOpen(!open) }}>
            <View style={styles.mainContainer}>
                <Icon name="calendar-outline" type="ionicon" size={wp("7%")} color={color.grey0} />
                <Text style={styles.title0}>{value.toLocaleDateString("en-GB")}</Text>
            </View>
            <DatePicker
                modal
                open={open}
                date={value}
                onCancel={() => { setOpen(false) }}
                onConfirm={(date) => { setOpen(false); onConfirm(date); }}
                mode="date"
            />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        alignSelf: "center",
        backgroundColor: color.white1,
        padding: wp("4%"),
        width: wp("40%"),
        borderRadius: 12
    },
    title0: {
        fontSize: wp("3.7%"),
        color: color.grey0,
        fontFamily: font.semibold,
    },
})

export default CustomDatePicker;