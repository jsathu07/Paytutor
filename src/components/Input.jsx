import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from 'react-native';
import { Input } from '@rneui/base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { color, font } from "../utils/theme"

const CustomInput = ({ value, onChangeText, type, placeholder = "Enter your details ...", keyboardType = "default" }) => {

    const [focus, setFocus] = useState(false);

    return (
        <View>
            <Input
                autoCorrect={false}
                autoFocus={false}
                placeholder={placeholder}
                placeholderTextColor={color.grey0}
                inputStyle={styles.inputText}
                selectionColor={color.blue0}
                value={value}
                secureTextEntry={type === "password" ? true : false}
                keyboardType={keyboardType}
                autoCapitalize={type === "text" ? "sentences" : "none"}
                onChangeText={onChangeText}
                containerStyle={{ paddingLeft: 0, paddingRight: 0, paddingBottom: 0, marginTop: hp("1%") }}
                onFocus={() => { setFocus(true) }}
                onBlur={() => { setFocus(false) }}
                inputContainerStyle={[styles.input, { borderColor: focus ? color.blue0 : color.grey1 }]} />
        </View>
    )
}

const styles = StyleSheet.create({
    input: {
        width: wp("85%"),
        borderWidth: 2,
        borderBottomWidth: 2,
        borderColor: color.grey1,
        borderRadius: 12,
        padding: wp("0.5%")
    },
    inputText: {
        fontFamily: font.semibold,
        fontSize: wp("4%"),
        color: color.black0,
        marginLeft: wp("2%"),
        padding: 0
    }
})

export default CustomInput;