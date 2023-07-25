import React from "react";
import { StyleSheet, View, Text } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { color, font } from "../utils/theme"
import { Divider } from '@rneui/base';

const Subject = ({ text1, text2, text3, isTotal = false }) => {
    return (
        <View style={{ marginTop: hp("3%") }}>
            <View style={styles.mainContainer}>
                <View style={{ flexDirection: "column" }}>
                    <Text style={styles.title0}>{text1}</Text>
                    <Text style={styles.title1}>{text2}</Text>
                </View>
                <Text style={styles.title2}>{text3}</Text>
            </View>
            {
                !isTotal &&
                (
                    <Divider />
                )
            }
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: hp("2%"),
    },
    title0: {
        fontSize: wp("4%"),
        color: color.black0,
        fontFamily: font.semibold,
        width: wp("50%")
    },
    title1: {
        fontSize: wp("3%"),
        color: color.grey0,
        fontFamily: font.regular,
        width: wp("50%"),
        marginTop: hp("0.5%")
    },
    title2: {
        fontSize: wp("4%"),
        color: color.black0,
        fontFamily: font.semibold,
        width: wp("20%"),
    },
})

export default Subject;