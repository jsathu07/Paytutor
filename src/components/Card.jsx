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
            {/* style={{ position: "absolute", left: wp("100%") }} */}
            <ViewShot ref={ref} options={{ fileName: value, format: "png", quality: 1 }}>
                <View style={styles.container}>
                    {/* marginTop:hp("5%") padding:wp("6%") */}
                    <View style={{ marginTop: 40, backgroundColor: color.white1, padding: 15, borderRadius: 12, borderWidth: 0, borderStyle: "dashed" }}>
                        {/* wp("12%") */}
                        <Avatar rounded={true} containerStyle={{ marginTop: -45, alignSelf: "center" }} size={45} source={{ uri: img }} />
                        <QRCode
                            value={value}
                            size={170}
                        // size={wp("45%")}
                        />
                    </View>
                    <Text style={styles.innerTitle}>{text1}</Text>
                    <Text style={styles.innerTitleTwo}>{text2}</Text>
                    <View style={{ width: 300, backgroundColor: color.blue0, borderBottomLeftRadius: 12, borderBottomRightRadius: 12 }}>
                        {/* width: wp(30) height:wp(12) */}
                        <Image style={{ width: 110, height: 40, alignSelf: "center" }} source={require("../../logo.png")} />
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
        width: 300, //wp(90%)
        backgroundColor: color.white0,
        borderRadius: 12,
        alignSelf: "center",
        marginTop: 10 //hp(2%)
    },
    innerTitle: {
        fontSize: 18, //wp("5%"),
        color: color.black0,
        fontFamily: font.semibold,
        marginTop: 15 //hp(2%)
    },
    innerTitleTwo: {
        fontSize: 14, //wp(3.5%)
        color: color.grey0,
        fontFamily: font.semibold,
        marginTop: 8, //hp("1%")
        marginBottom: 20 //hp("4%")
    },
})

export default Card;