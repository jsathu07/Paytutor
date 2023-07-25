import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Button } from '@rneui/base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { color, font } from "../utils/theme"

const CustomButton = ({ text, onPress, styleText = {}, style = {} }) => {
    return (
        <View>
            <Button onPress={onPress} buttonStyle={[styles.button, style]}>
                <Text style={[styles.buttonText, styleText]}>{text}</Text>
            </Button>
        </View>
    )
}

const styles = StyleSheet.create({
    button: {
        width: wp("85%"),
        height: hp("7%"),
        backgroundColor: color.blue0,
        alignSelf: "center",
        borderRadius: 12,
        alignItems: "center"
    },
    buttonText: {
        fontFamily: font.bold,
        fontSize: wp("4%"),
        color: color.white0
    },
})

export default CustomButton;