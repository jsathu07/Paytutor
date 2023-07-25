import { useState } from "react";
import { SafeAreaView, StyleSheet, View, Text, ScrollView, StatusBar, Image } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import Button from "../../components/Button";
import Input from "../../components/Input";
import CheckBox from '../../components/Checkbox';
import ImagePicker from 'react-native-image-crop-picker';
import { color, font } from '../../utils/theme';

const SignUpScreen = ({ navigation }) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [name, setName] = useState("");
    const [selectedImg, setSelectedImg] = useState("");
    const [checked, setChecked] = useState(false);

    const openGallery = async () => {
        const result = await ImagePicker.openPicker({ cropping: true })
        setSelectedImg(result.path)
    }

    const SignUp = async () => {
        try {
            if (email === "" || password === "" || phone === "" || name === "" || selectedImg === "" || !checked) {
                throw new Error("empty");
            }
            const authResult = await auth().createUserWithEmailAndPassword(email, password);
            const reference = storage().ref(`/Users/logo/${authResult.user.uid}`);
            await reference.putFile(selectedImg);
            const url = await storage().ref(`/Users/logo/${authResult.user.uid}`).getDownloadURL();
            let userData = {
                uid: authResult.user.uid,
                email,
                password,
                name,
                phone,
                img: url
            }
            await firestore().collection("User").doc(authResult.user.uid).set(userData);
        } catch (error) {
            console.log(error)
            if (error.code === "auth/email-already-in-use") {
                alert("EMAIL ALREADY IN USE")
            }
            if (error.code === "auth/invalid-email") {
                alert("INVALID EMAIL")
            }
            if (error.code === "auth/weak-password") {
                alert("WEAK PASSWORD")
            }
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>

                <View style={{ backgroundColor: color.blue0, padding: wp("6%") }}>
                    <Image style={{ width: wp("60%"), height: wp("30%"), alignSelf: "center" }} source={require("../../../logo.png")} />
                </View>

                <View style={{ height: hp("100%"), borderColor: color.white0, borderWidth: 1, borderTopRightRadius: 25, borderTopLeftRadius: 25, backgroundColor: color.white0 }}>

                    <Text style={styles.title0}>Sign up for an account</Text>

                    <View style={styles.textBox}>
                        <Text style={styles.text0}>Organization name</Text>
                        <Input type="text" value={name} onChangeText={(name) => { setName(name) }} />
                        <Text style={styles.text0}>Email</Text>
                        <Input type="email" onChangeText={(email) => { setEmail(email) }} value={email} keyboardType="email-address" />
                        <Text style={styles.text0}>Password</Text>
                        <Input type="password" value={password} onChangeText={(password) => { setPassword(password) }} />
                        <Text style={styles.text0}>Phone</Text>
                        <Input placeholder="0762206823" type="phone" value={phone} onChangeText={(phone) => { setPhone(phone) }} keyboardType="phone-pad" />
                    </View>

                    <CheckBox onPress={() => { openGallery() }} checked={selectedImg !== "" ? true : false} text="Upload Image" />

                    <CheckBox checked={checked} text="Accept terms and conditions" onPress={() => { setChecked(!checked) }} />

                    <Button style={{ marginTop: hp("5%") }} onPress={SignUp} text="Sign Up" />
                </View>

                <StatusBar backgroundColor={color.blue0} />
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.blue0,
    },
    title0: {
        fontSize: wp("5%"),
        color: color.black0,
        fontFamily: font.bold,
        marginTop: hp("5%"),
        marginLeft: wp("8%")
    },
    textBox: {
        marginTop: hp("5%"),
        alignSelf: "center"
    },
    text0: {
        fontFamily: font.regular,
        fontSize: wp("4%"),
        color: color.grey0,
    }
});

export default SignUpScreen;