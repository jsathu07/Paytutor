import { useState, useRef, useEffect } from "react";
import { SafeAreaView, StyleSheet, View, Text, ScrollView, StatusBar, Image, ActivityIndicator } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import firestore from '@react-native-firebase/firestore';
import { useSelector } from "react-redux";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Picker from "../../components/Picker";
import NavBar from "../../components/NavBar";
import { color, font } from '../../utils/theme';
import TextClick from "../../components/TextClick";
import DropDownHolder from "../../utils/Dropdown";

const ClassRegisterScreen = ({ navigation }) => {

    const [name, setName] = useState("");
    const [fee, setFee] = useState("");
    const [selectedTutor, setSelectedTutor] = useState("");
    const [tutorName, setTutorName] = useState("");
    const [tutorList, setTutorList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isClass, setIsClass] = useState(false);
    const [isScrollEnabled, setIsScrollEnabled] = useState(true);

    const userData = useSelector((state) => state.user.data);
    const tutorData = useSelector((state) => state.data.tutor);

    const registerTeacher = async () => {
        try {
            if (tutorName === "") {
                DropDownHolder.dropDown.alertWithType("error", "Invalid name", "Please enter a valid name!");
                return;
            }
            setIsLoading(true);
            await firestore().collection("User").doc(userData.uid).collection("Tutor").add({ name: tutorName.trim() });
            const d = await getTutorList();
            setTutorList(d);
            setTutorName("");
            setIsLoading(false);
            DropDownHolder.dropDown.alertWithType("success", "Success", "Tutor has been added successfully!");
        } catch (error) {
            setIsLoading(false);
            DropDownHolder.dropDown.alertWithType("error", "Operation failed", "Please restart the app and try again!");
        }
    }

    const registerClass = async () => {
        try {
            if (name === "" || parseInt(fee) <= 0 || selectedTutor === "") {
                DropDownHolder.dropDown.alertWithType("error", "Missing details", "Please enter all details!");
                return;
            }
            setIsLoading(true);
            await firestore().collection("User").doc(userData.uid).collection("Class").add({ name: name.trim(), fee: parseInt(fee), tutor: selectedTutor });
            setSelectedTutor("");
            setName("");
            setFee("");
            setIsLoading(false);
            DropDownHolder.dropDown.alertWithType("success", "Success", "Class has been added successfully!");
        } catch (error) {
            setIsLoading(false);
            DropDownHolder.dropDown.alertWithType("error", "Operation failed", "Please restart the app and try again!");
        }
    }

    const getTutorList = async () => {
        return new Promise((resolve, reject) => {
            const temp = Object.values(tutorData).map((val) => { return { value: val.id, label: val.name } });
            resolve(temp);
        })
    }

    useEffect(() => {
    }, [userData, tutorData])

    if (isLoading) {
        return (
            <SafeAreaView style={{ backgroundColor: color.white0, flex: 1, alignItems: "center", justifyContent: "center" }}>
                <ActivityIndicator color={color.blue0} size="large" />
            </SafeAreaView>
        )
    } else {
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView scrollEnabled={isScrollEnabled}>

                    <NavBar text="Back" onPress={() => { navigation.goBack() }} />

                    <Image style={{ width: wp("80%"), height: wp("50%"), alignSelf: "center" }} source={require("../../assets/images/class.png")} />

                    {
                        isClass ? (
                            <View>
                                <TextClick onPress={() => { setIsClass(false); }} text1="Want to register a tutor?" text2="Register" />

                                <Text style={styles.title0}>Register a class</Text>

                                <View style={styles.textBox}>
                                    <Text style={styles.text0}>Name</Text>
                                    <Input placeholder="Enter class name ..." type="text" onChangeText={(name) => { setName(name) }} value={name} />
                                    <Text style={styles.text0}>Fee</Text>
                                    <Input placeholder="Enter class fee ..." keyboardType="number-pad" type="number" onChangeText={(fee) => { setFee(fee) }} value={fee} />
                                    <Text style={styles.text0}>Tutor</Text>
                                    <Picker onOpen={() => { setIsScrollEnabled(false) }} onClose={() => { setIsScrollEnabled(true) }} placeholder="Select a tutor ..." max={1} data={tutorList} value={tutorList} onChangeValue={(selectedTutor) => {
                                        if (selectedTutor.length > 0) {
                                            setSelectedTutor(selectedTutor[0])
                                        }
                                    }} />
                                </View>

                                <Button text="Register class" onPress={registerClass} />

                            </View>
                        )
                            : (
                                <View>
                                    <Text style={styles.title0}>Register a tutor</Text>

                                    <View style={styles.textBox}>
                                        <Text style={styles.text0}>Name</Text>
                                        <Input placeholder="Enter tutor name ..." type="text" onChangeText={(tutorName) => { setTutorName(tutorName) }} value={tutorName} />
                                    </View>

                                    <Button text="Register tutor" onPress={registerTeacher} />

                                    <TextClick onPress={async () => {
                                        const d = await getTutorList();
                                        setTutorList(d);
                                        setIsClass(true);
                                    }} text1="Want to register a class?" text2="Register" />
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
        backgroundColor: color.white0,
    },
    title0: {
        fontSize: wp("5%"),
        color: color.black0,
        fontFamily: font.semibold,
        marginTop: hp("4%"),
        marginLeft: wp("7%")
    },
    textBox: {
        marginTop: hp("3%"),
        marginBottom: hp("4%"),
        alignSelf: "center",
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

export default ClassRegisterScreen;