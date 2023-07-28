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
import Loader from "../../components/Loader";

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
            const result = await firestore().collection("User").doc(userData.uid).collection("Class").add({ name: name.trim(), fee: parseInt(fee), tutor: selectedTutor, count: 0 });
            await firestore().collection("User").doc(userData.uid).collection("Tutor").doc(selectedTutor).collection("Class").doc(result.id).set({ enrolledDate: new Date().getTime() })
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

    const getTutorList = () => {
        setIsLoading(true);
        const temp = Object.values(tutorData).map((val) => { return { value: val.id, label: val.name } });
        setTutorList(temp);
        setIsLoading(false);
        setIsClass(true);
    }

    useEffect(() => {
    }, [userData, tutorData])

    if (isLoading) {
        return (
            <Loader />
        )
    } else {
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView scrollEnabled={isScrollEnabled}>

                    <NavBar text="Back" onPress={() => { navigation.goBack() }} />

                    <Image style={{ width: wp("75%"), height: wp("50%"), alignSelf: "flex-start" }} source={require("../../assets/images/learning.png")} />

                    {
                        isClass ? (
                            <View>
                                <Text style={styles.title0}>Class registration</Text>

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

                                <TextClick onPress={() => { setIsClass(false); }} text1="Want to register a tutor?" text2="Register" />
                            </View>
                        )
                            : (
                                <View>
                                    <Text style={styles.title0}>Tutor registration</Text>

                                    <View style={styles.textBox}>
                                        <Text style={styles.text0}>Name</Text>
                                        <Input placeholder="Enter tutor name ..." type="text" onChangeText={(tutorName) => { setTutorName(tutorName) }} value={tutorName} />
                                    </View>

                                    <Button text="Register tutor" onPress={registerTeacher} />

                                    <TextClick onPress={getTutorList} text1="Want to register a class?" text2="Register" />
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
        fontFamily: font.bold,
        marginTop: hp("2%"),
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