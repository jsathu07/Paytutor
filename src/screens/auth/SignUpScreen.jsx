import { useState } from "react";
import { SafeAreaView, StyleSheet, View, Text, ScrollView, StatusBar, Image, Linking, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import auth from '@react-native-firebase/auth';
import ImagePicker from 'react-native-image-crop-picker';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import Button from "../../components/Button";
import Input from "../../components/Input";
import CheckBox from '../../components/Checkbox';
import Option from "../../components/Option";
import Loader from "../../components/Loader";
import DropDownHolder from "../../utils/Dropdown";
import { color, font } from '../../utils/theme';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import TextClick from "../../components/TextClick";
import { Icon } from '@rneui/base';

const SignUpScreen = ({ navigation }) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [name, setName] = useState("");
    const [selectedImg, setSelectedImg] = useState("");
    const [checked, setChecked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const openGallery = async () => {
        if (Platform.OS === "ios") {
            const permResult = await check(PERMISSIONS.IOS.PHOTO_LIBRARY)
            if (permResult !== RESULTS.GRANTED) {
                const r = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
                if (r === RESULTS.GRANTED) {
                    const result = await ImagePicker.openPicker({ cropping: true });
                    setSelectedImg(result.path);
                } else {
                    DropDownHolder.dropDown.alertWithType("error", "Permission denied", "Please give access to gallery");
                }
            } else {
                const result = await ImagePicker.openPicker({ cropping: true });
                setSelectedImg(result.path)
            }
        } else {
            const result = await ImagePicker.openPicker({ cropping: true });
            setSelectedImg(result.path)
        }
    }

    const SignUp = async () => {
        try {
            if (email === "" || password === "" || phone === "" || name === "" || selectedImg === "") {
                DropDownHolder.dropDown.alertWithType("error", "User details required", "Please enter your details!");
                return;
            }
            if (!checked) {
                DropDownHolder.dropDown.alertWithType("error", "Accept privacy policy", "Please accept the privacy policy!");
                return;
            }
            let phoneRg = /^07[0125678]\d{7}$/;
            if (phone.match(phoneRg) === null) {
                DropDownHolder.dropDown.alertWithType("error", "Invalid phone number", "Please enter a valid phone number!");
                return;
            }
            setIsLoading(true);
            const authResult = await auth().createUserWithEmailAndPassword(email, password);
            const reference = storage().ref(`/Users/logo/${authResult.user.uid}`);
            await reference.putFile(selectedImg);
            const url = await storage().ref(`/Users/logo/${authResult.user.uid}`).getDownloadURL();
            let userData = {
                uid: authResult.user.uid,
                email,
                password,
                name: name.trim(),
                phone,
                img: url,
                isSmsEnabled: false,
                msgCount: 2,
                lastPayment: null,
                transCount: 0
            }
            await firestore().collection("User").doc(authResult.user.uid).set(userData);
            await auth().currentUser.sendEmailVerification();
            await auth().signOut();
            navigation.navigate("SignIn");
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            if (error.code === "auth/email-already-in-use") {
                DropDownHolder.dropDown.alertWithType("error", "Email already used", "Please sign up using a new email address!");
            }
            if (error.code === "auth/invalid-email") {
                DropDownHolder.dropDown.alertWithType("error", "Email is invalid", "Please enter a valid email!");
            }
            if (error.code === "auth/weak-password") {
                DropDownHolder.dropDown.alertWithType("error", "Weak password", "Please enter a strong password!");
            }
        }
    }

    if (isLoading) {
        return (
            <Loader />
        )
    } else {
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView>

                    <View style={{ backgroundColor: color.blue0, padding: wp("6%") }}>
                        <Image style={{ width: wp("40%"), height: wp("15%"), alignSelf: "center" }} source={require("../../../logo.png")} />
                    </View>

                    <View style={{ borderColor: color.white0, borderWidth: 1, borderTopRightRadius: 25, borderTopLeftRadius: 25, backgroundColor: color.white0 }}>

                        <View style={styles.topContainer}>
                            <Text style={styles.title0}>Sign up for an account</Text>
                            <TouchableOpacity onPress={() => { navigation.navigate("AdminAuth") }}>
                                <Icon name="person-add-outline" type="ionicon" size={wp("7%")} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.textBox}>
                            <Text style={styles.text0}>Organization name</Text>
                            <Input placeholder="Enter your name ..." type="text" value={name} onChangeText={(name) => { setName(name) }} />
                            <Text style={styles.text0}>Email</Text>
                            <Input placeholder="Enter your email ..." type="email" onChangeText={(email) => { setEmail(email) }} value={email} keyboardType="email-address" />
                            <Text style={styles.text0}>Password</Text>
                            <Input placeholder="Enter your password ..." type="password" value={password} onChangeText={(password) => { setPassword(password) }} />
                            <Text style={styles.text0}>Phone</Text>
                            <Input placeholder="07xxxxxxxx" type="phone" value={phone} onChangeText={(phone) => { setPhone(phone) }} keyboardType="phone-pad" />
                            <Text style={styles.text0}>Logo</Text>
                            <Option onPress={() => { openGallery() }} checked={selectedImg !== "" ? true : false} />
                        </View>

                        <CheckBox isLink={true} onLinkPress={() => { Linking.openURL("https://paytutor.web.app/privacy.html") }} checked={checked} text="Accept terms and conditions" onPress={() => { setChecked(!checked) }} />

                        <Button style={{ marginTop: hp("0%") }} onPress={SignUp} text="Sign Up" />

                        <TextClick onPress={() => { navigation.navigate("SignIn") }} text1="Already have an account?" text2="Sign In" />

                        <View style={{ height: hp("10%") }}></View>
                    </View>

                    <StatusBar backgroundColor={color.blue0} />
                </ScrollView>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.blue0,
    },
    topContainer: {
        flexDirection: "row",
        width: wp("85%"),
        justifyContent: "space-between",
        marginTop: hp("5%"),
        alignSelf: "center",
    },
    title0: {
        fontSize: wp("5%"),
        color: color.black0,
        fontFamily: font.bold,
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