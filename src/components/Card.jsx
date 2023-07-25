import { useRef } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { color, font } from "../utils/theme";
import { Avatar } from '@rneui/base';
import QRCode from 'react-native-qrcode-svg';
import ViewShot from "react-native-view-shot";
import Share from 'react-native-share';
import Button from './Button';

const Card = ({ text1, text2, value, img }) => {

    const ref = useRef(null);

    return (
        <View>
            <ViewShot ref={ref} options={{ fileName: value, format: "png", quality: 1 }}>
                <View style={styles.container}>
                    <Image style={{ resizeMode: "contain", width: wp("20%"), height: wp("10%"), alignSelf: "flex-end", marginTop: hp("1%"), marginRight: wp("2%") }} source={require("../assets/images/smallLogoBlue.png")} />
                    <View style={{ marginTop: hp("4%"), backgroundColor: color.white1, padding: wp("6%"), borderRadius: 12, borderWidth: 0, borderStyle: "dashed" }}>
                        <Avatar rounded={true} containerStyle={{ marginTop: -45, alignSelf: "center" }} size={wp("12%")} source={{ uri: img }} />
                        <QRCode
                            value={value}
                            size={wp("45%")}
                        />
                    </View>
                    <Text style={styles.innerTitle}>{text1}</Text>
                    <Text style={styles.innerTitleTwo}>{text2}</Text>
                </View>
            </ViewShot>

            <Button style={{ marginTop: hp("6%") }} onPress={() => { ref.current.capture().then(async (e) => { await Share.open({ message: `Payment card for ${text2}`, url: e }) }) }} text="Share" />

            <Button style={{ marginTop: hp("2%") }} text="Send" />

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
        alignSelf: "center"
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
        marginTop: hp("2%"),
        marginBottom: hp("4%")
    },
})

export default Card;