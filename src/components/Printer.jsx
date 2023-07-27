import { useEffect, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { BluetoothManager, BluetoothEscposPrinter } from '@brooons/react-native-bluetooth-escpos-printer';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { color, font } from '../utils/theme';
import { Icon } from '@rneui/base';

const Printer = ({ data }) => {

    const [status, setStatus] = useState(false);

    const onPrint = async () => {
        // await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
        // await BluetoothEscposPrinter.setBlob(0);
        // await BluetoothEscposPrinter.printText("Hello World\n\r", {
        //     encoding: 'GBK',
        //     codepage: 0,
        //     widthtimes: 3,
        //     heigthtimes: 3,
        //     fonttype: 1,
        // })
    }

    return (
        <TouchableOpacity onPress={onPrint}>
            <View style={styles.itemContainer}>
                <Icon name="print-outline" type="ionicon" size={wp("7%")} />

                <View>
                    <Text style={styles.innerTitle}>Printer info</Text>
                    <Text style={styles.innerTitle1}>Connect the printer with your phone</Text>
                </View>

                <View style={[styles.paid, { backgroundColor: status ? color.green0 : color.red0 }]}>
                    <Text style={[styles.paidText, { color: status ? color.green1 : color.red1 }]}>{status ? "Connected" : "Not Connected"}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    itemContainer: {
        width: wp("90%"),
        borderRadius: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: wp("4%"),
        backgroundColor: color.white1,
        marginTop: hp("2%"),
        alignSelf: "center"
    },
    innerTitle: {
        fontSize: wp("4%"),
        color: color.black0,
        fontFamily: font.semibold,
        width: wp("30%")
    },
    innerTitle1: {
        fontSize: wp("3%"),
        color: color.grey0,
        fontFamily: font.semibold,
        width: wp("30%")
    },
    paid: {
        width: wp("30%"),
        borderRadius: 12,
        backgroundColor: color.green0,
        justifyContent: "center",
        alignItems: "center",
        padding: wp("2%")
    },
    paidText: {
        fontSize: wp("3.5%"),
        color: color.green1,
        fontFamily: font.bold,
    }
})

export default Printer;