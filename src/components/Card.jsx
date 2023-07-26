import { useRef } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { color, font } from "../utils/theme";
import { Avatar, Icon } from '@rneui/base';
import QRCode from 'react-native-qrcode-svg';
import ViewShot from "react-native-view-shot";
import Share from 'react-native-share';

const Card = ({ text1, text2, value, img }) => {

    const ref = useRef(null);

    return (
        <View>
            <TouchableOpacity onPress={() => { ref.current.capture().then(async (e) => { await Share.open({ message: `Payment card for ${text2}`, url: e }) }) }}>
                <Icon style={{ alignSelf: "flex-end", marginRight: wp("5%") }} name="share-outline" type="ionicon" size={wp("7%")} />
            </TouchableOpacity>

            <ViewShot ref={ref} options={{ fileName: value, format: "png", quality: 1 }}>
                <View style={styles.container}>
                    <View style={{ marginTop: hp("5%"), backgroundColor: color.white1, padding: wp("6%"), borderRadius: 12, borderWidth: 0, borderStyle: "dashed" }}>
                        <Avatar rounded={true} containerStyle={{ marginTop: -45, alignSelf: "center" }} size={wp("12%")} source={{ uri: img }} />
                        <QRCode
                            value={value}
                            size={wp("45%")}
                        />
                    </View>
                    <Text style={styles.innerTitle}>{text1}</Text>
                    <Text style={styles.innerTitleTwo}>{text2}</Text>
                    <View style={{ width: wp("90%"), backgroundColor: color.blue0, borderBottomLeftRadius: 12, borderBottomRightRadius: 12 }}>
                        <Image style={{ width: wp("30%"), height: wp("12%"), alignSelf: "center" }} source={require("../../logo.png")} />
                    </View>
                </View>
            </ViewShot>

            <View style={{ height: hp("3%") }}></View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.18,
        shadowRadius: 4.59,
        elevation: 2,
        alignItems: "center",
        width: wp("90%"),
        backgroundColor: color.white0,
        borderRadius: 12,
        alignSelf: "center",
        marginTop: hp("2%")
    },
    innerTitle: {
        fontSize: wp("5%"),
        color: color.black0,
        fontFamily: font.semibold,
        marginTop: hp("2%")
    },
    innerTitleTwo: {
        fontSize: wp("3.5%"),
        color: color.grey0,
        fontFamily: font.semibold,
        marginTop: hp("1%"),
        marginBottom: hp("4%")
    },
})

export default Card;