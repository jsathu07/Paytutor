import { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, View, Text, ScrollView, StatusBar, Image } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import auth from '@react-native-firebase/auth';
import functions from '@react-native-firebase/functions';
import Button from "../../components/Button";
import Input from "../../components/Input";
import DropDownHolder from "../../utils/Dropdown";
import { color, font } from '../../utils/theme';
import Loader from "../../components/Loader";

const AdminAuthScreen = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const createAdmin = async () => {
        try {
            if (email === "" || password === "") {
                DropDownHolder.dropDown.alertWithType("error", "User details required", "Please enter your details!");
                return;
            }
            setIsLoading(true);
            const result = await auth().createUserWithEmailAndPassword(email, password);
            functions().httpsCallable('setAdmin')({ uid: result.user.uid })
                .catch((error) => { console.log(error) })
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            if (error.code === "auth/wrong-password") {
                DropDownHolder.dropDown.alertWithType("error", "Wrong password", "Please enter your correct password!");
            }
            if (error.code === "auth/user-not-found") {
                DropDownHolder.dropDown.alertWithType("error", "User not found", "Please enter a valid email!");
            }
        }
    }

    const checkAdmin = async () => {
        const e = await auth().currentUser.getIdTokenResult(true);
        const isAdmin = e.claims.admin === true;
        if (isAdmin) {
            setIsAdmin(true);
        }
    }

    useEffect(() => {
        checkAdmin();
    }, [])

    if (isLoading) {
        return (
            <Loader />
        )
    } else if (isAdmin) {
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView>

                    <View style={{ backgroundColor: color.blue0, padding: wp("6%") }}>
                        <Image style={{ width: wp("40%"), height: wp("15%"), alignSelf: "center" }} source={require("../../../logo.png")} />
                    </View>

                    <View style={{ height: hp("100%"), borderColor: color.white0, borderWidth: 1, borderTopRightRadius: 25, borderTopLeftRadius: 25, backgroundColor: color.white0 }}>
                        <Text style={styles.title0}>Create an admin account</Text>

                        <View style={styles.textBox}>
                            <Text style={styles.text0}>Email</Text>
                            <Input placeholder="Enter your email ..." keyboardType="email-address" type="email" onChangeText={(email) => { setEmail(email) }} value={email} />
                            <Text style={styles.text0}>Your password</Text>
                            <Input placeholder="Enter your password ..." type="password" onChangeText={(password) => { setPassword(password) }} value={password} />
                        </View>

                        <Button style={{ marginTop: hp("2%") }} onPress={createAdmin} text="Create admin account" />

                    </View>

                    <StatusBar backgroundColor={color.blue0} />
                </ScrollView>
            </SafeAreaView>
        )
    } else {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: color.white0, justifyContent: "center", alignItems: "center" }}>

                <Text style={styles.text1}>Contact your account owner</Text>

                <StatusBar backgroundColor={color.blue0} />
            </SafeAreaView>
        )
    }
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
        marginLeft: wp("7%")
    },
    textBox: {
        marginTop: hp("5%"),
        alignSelf: "center"
    },
    text0: {
        fontFamily: font.regular,
        fontSize: wp("4%"),
        color: color.grey0,
    },
    text1: {
        fontFamily: font.semibold,
        fontSize: wp("4%"),
        color: color.black0,
    }
});

export default AdminAuthScreen;