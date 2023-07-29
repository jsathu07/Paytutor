import { useState, useEffect, useRef } from "react";
import { SafeAreaView, StyleSheet, View, Text, StatusBar, Image, ActivityIndicator, ScrollView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import firestore from '@react-native-firebase/firestore';
import Button from "../../components/Button";
import { useSelector } from "react-redux";
import Input from "../../components/Input";
import Picker from "../../components/Picker";
import DropDownHolder from "../../utils/Dropdown";
import { color, font } from '../../utils/theme';
import Card from "../../components/Card";
import NavBar from "../../components/NavBar";
import Loader from "../../components/Loader";
import CheckBox from "../../components/Checkbox";

const RegistrationScreen = ({ navigation }) => {

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [enrolledClass, setEnrolledClass] = useState([]);
    const [classList, setClassList] = useState([]);
    const [showQR, setShowQR] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isScrollEnabled, setIsScrollEnabled] = useState(true);
    const [checked, setChecked] = useState(false);
    const [id, setId] = useState("");

    const userData = useSelector((state) => state.user.data);
    const classData = useSelector((state) => state.data.data);

    const registerStudent = async () => {
        try {
            if (name === "" || enrolledClass.length === 0) {
                DropDownHolder.dropDown.alertWithType("error", "Missing details", "Please enter all details!");
                return;
            }
            let phoneRg = /^07[0125678]\d{7}$/;
            if (phone.match(phoneRg) === null) {
                DropDownHolder.dropDown.alertWithType("error", "Invalid phone number", "Please enter a valid phone number!");
                return;
            }
            setIsLoading(true);
            const time = new Date();
            if (checked) {
                time.setMonth(time.getMonth() + 1);
            }
            const finalTime = time.getTime();
            const result = await firestore().collection("User").doc(userData.uid).collection("Student").add({ name: name.trim(), phone, last_payment: null, enrolledDate: finalTime })
            enrolledClass.forEach(async (classId) => {
                await firestore().collection("User").doc(userData.uid).collection("Student").doc(result.id).collection("EnrolledClass").doc(classId).set({ enrolledDate: finalTime, id: result.id })
                await firestore().collection("User").doc(userData.uid)
                    .collection("Class").doc(classId)
                    .collection("Student").doc(result.id).set({ enrolledDate: finalTime, id: result.id })
                await firestore().collection("User").doc(userData.uid).collection("Class").doc(classId).update({
                    count: firestore.FieldValue.increment(1)
                })
            })
            setEnrolledClass([]);
            setPhone("");
            setId(result.id);
            setIsLoading(false);
            setShowQR(true);
            DropDownHolder.dropDown.alertWithType("success", "Success", "Student has been added successfully!");
        } catch (error) {
            setIsLoading(false);
            DropDownHolder.dropDown.alertWithType("error", "Operation failed", "Please restart the app and try again!");
        }
    }

    const getClassList = () => {
        setIsLoading(true);
        const temp = Object.values(classData).map((val) => { return { value: val.id, label: val.name } })
        setClassList(temp);
        setIsLoading(false);
    }

    useEffect(() => {
        getClassList();
    }, [classData, userData])

    if (isLoading) {
        return (
            <Loader />
        )
    } else {
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView scrollEnabled={isScrollEnabled}>
                    {
                        showQR ? (
                            <View>
                                <NavBar text="Back" onPress={() => { setId(""); setShowQR(false); setName("") }} />
                                <View style={{ marginTop: hp("5%") }}>
                                    <Card img={userData.img} value={id} text1={name} text2={userData.name} />
                                </View>
                            </View>
                        )
                            :
                            (
                                <View>
                                    <Image style={{ width: wp("50%"), height: wp("45%"), alignSelf: "flex-start", marginTop: hp("2%") }} source={require("../../assets/images/post.png")} />

                                    <Text style={styles.title0}>Student registration</Text>

                                    <View style={styles.textBox}>
                                        <Text style={styles.text0}>Name</Text>
                                        <Input placeholder="Enter student name ..." type="text" value={name} onChangeText={(name) => { setName(name) }} />
                                        <Text style={styles.text0}>Phone</Text>
                                        <Input placeholder="07xxxxxxxx" keyboardType="phone-pad" type="phone" value={phone} onChangeText={(phone) => { setPhone(phone) }} />
                                        <Text style={styles.text0}>Class</Text>
                                        <Picker onOpen={() => { setIsScrollEnabled(false) }} onClose={() => { setIsScrollEnabled(true) }} placeholder="Select a class ..." val={enrolledClass} max={null} data={classList} onChangeValue={(enrolledClass) => { setEnrolledClass(enrolledClass) }} />
                                    </View>

                                    <CheckBox checked={checked} text="Register for next month" onPress={() => { setChecked(!checked) }} />

                                    <Button text="Register" onPress={registerStudent} />
                                </View>
                            )
                    }
                    <View style={{ height: hp("10%") }}></View>
                    <StatusBar backgroundColor={color.blue0} />
                </ScrollView>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.white0
    },
    title0: {
        fontSize: wp("5%"),
        color: color.black0,
        fontFamily: font.bold,
        marginTop: hp("2%"),
        marginLeft: wp("7%")
    },
    textBox: {
        marginTop: hp("3%"),
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

export default RegistrationScreen;