import { useState } from "react";
import { SafeAreaView, StyleSheet, View, Text, ScrollView, StatusBar, Image } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import auth from '@react-native-firebase/auth';
import Button from "../../components/Button";
import Input from "../../components/Input";
import TextClick from "../../components/TextClick";
import DropDownHolder from "../../utils/Dropdown";
import { color, font } from '../../utils/theme';
import Loader from "../../components/Loader";

const SignInScreen = ({ navigation }) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const SignIn = async () => {
        try {
            if (email === "" || password === "") {
                DropDownHolder.dropDown.alertWithType("error", "User details required", "Please enter your details!");
                return;
            }
            setIsLoading(true);
            const user = await auth().signInWithEmailAndPassword(email, password);
            // if (!user.user.emailVerified) {
            //     await auth().signOut();
            //     DropDownHolder.dropDown.alertWithType("error", "Verify your email", "Please verify your email");
            // }
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

                    <View style={{ height: hp("100%"), borderColor: color.white0, borderWidth: 1, borderTopRightRadius: 25, borderTopLeftRadius: 25, backgroundColor: color.white0 }}>
                        <Text style={styles.title0}>Sign in to PayTutor</Text>

                        <View style={styles.textBox}>
                            <Text style={styles.text0}>Email</Text>
                            <Input placeholder="Enter your email ..." keyboardType="email-address" type="email" onChangeText={(email) => { setEmail(email) }} value={email} />
                            <Text style={styles.text0}>Your password</Text>
                            <Input placeholder="Enter your password ..." type="password" onChangeText={(password) => { setPassword(password) }} value={password} />
                        </View>

                        <Button style={{ marginTop: hp("2%") }} onPress={SignIn} text="Sign In" />

                        <TextClick onPress={() => { navigation.navigate("SignUp") }} text1="Don't have an account?" text2="Sign Up" />

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
    recover: {
        color: color.blue0,
        fontFamily: font.bold,
        fontSize: wp("3.7%"),
        marginRight: wp("8%")
    },
    txt: {
        fontSize: wp("4.5%"),
        color: color.grey0,
        fontFamily: font.regular,
        alignSelf: "center",
    }
});

export default SignInScreen;