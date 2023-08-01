import { useEffect, useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, ScrollView, StatusBar, Image, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useSelector } from "react-redux";
import { CameraScreen } from 'react-native-camera-kit';
import firestore from '@react-native-firebase/firestore';
import functions from '@react-native-firebase/functions';
import Button from "../../components/Button";
import { color, font } from '../../utils/theme';
import Subject from '../../components/Subject';
import TransItem from '../../components/TransItem';
import NavBar from '../../components/NavBar';
import ActionSheet from "react-native-actions-sheet";
import { FlashList } from "@shopify/flash-list";
import Card from '../../components/Card';
import NumericInput from '../../components/NumericInput';
import Printer from '../../components/Printer';
import { Icon } from '@rneui/base';
import uuid from 'react-native-uuid';
import DropDownHolder from '../../utils/Dropdown';

const PaymentScreen = ({ navigation, route }) => {

    const actionSheetRef = useRef(null);

    const [camera, setCamera] = useState(true);
    const [total, setTotal] = useState(0);
    const [enrolledClasses, setEnrolledClasses] = useState([]);
    const [student, setStudent] = useState({ name: "", phone: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [months, setMonths] = useState(0);
    const [currentMonths, setCurrentMonths] = useState(0);
    const [showMonth, setShowMonth] = useState(false);
    const [id, setId] = useState("");

    const studentData = useSelector((state) => state.student.data);
    const classData = useSelector((state) => state.data.data);
    const userData = useSelector((state) => state.user.data);
    const tutorData = useSelector((state) => state.data.tutor);

    const getStatus = (t, e) => {
        let diff;
        let d = new Date(t !== null ? t : e);
        let curr = new Date();
        if (d.getFullYear() == curr.getFullYear()) {
            diff = curr.getMonth() - d.getMonth();
        } else {
            diff = 11 - d.getMonth() + curr.getMonth() + (curr.getFullYear() - d.getFullYear() - 1) * 12;
        }
        if (t === null) diff++;

        if (diff <= 0) {
            diff = 0;
        }
        setMonths(diff);
        setCurrentMonths(diff);
    }

    const payFee = async () => {
        if (currentMonths <= 0) {
            return;
        }
        try {
            let transId = uuid.v4();
            setIsLoading(true);
            let final;
            if (studentData[id].lastPayment !== null) {
                final = new Date(studentData[id].lastPayment);
                final.setMonth(final.getMonth() + currentMonths);
            } else {
                final = new Date(studentData[id].enrolledDate);
                final.setMonth(final.getMonth() + currentMonths - 1);
            }
            const batch = firestore().batch();
            const stdRef = firestore().collection("User").doc(userData.uid).collection("Student").doc(id)
            batch.update(stdRef, { lastPayment: final.getTime() });
            const classInfo = enrolledClasses.map((e) => { return { tutorId: e.tutorId, classId: e.id, fee: e.fee } });
            let obj = {
                createdDate: new Date().getTime(),
                id: transId,
                studentId: id,
                value: total * currentMonths,
                type: "payment",
                classInfo,
                duration: currentMonths
            }
            const stdTransRef = firestore().collection("User").doc(userData.uid).collection("Student").doc(id).collection("Transaction").doc(transId);
            batch.set(stdTransRef, obj);
            const transRef = firestore().collection("User").doc(userData.uid).collection("Transaction").doc(transId);
            batch.set(transRef, obj);
            const userRef = firestore().collection("User").doc(userData.uid);
            batch.update(userRef, { transCount: firestore.FieldValue.increment(1) });
            await batch.commit();
            if (userData.isSmsEnabled && userData.msgCount > 0) {
                functions().httpsCallable('sendMessage')({ student, amount: total * currentMonths, userData })
                    .catch(() => {
                        DropDownHolder.dropDown.alertWithType("error", "Sending message failed", "Error occurred while sending SMS!");
                    })
            }
            functions().httpsCallable('updateTutorTransaction')({ info: obj, userData })
                .catch((error) => { console.log(error) })
            getStatus(final, studentData[id].enrolledDate);
            setIsLoading(false);
            DropDownHolder.dropDown.alertWithType("success", "Success", "Payment has been made successfully!");
        } catch (error) {
            DropDownHolder.dropDown.alertWithType("error", "Error occurred", "Error occurred while processing!");
        }
    }

    const getData = async (t) => {
        setIsLoading(true);
        setId(t);
        setCamera(false);
        setStudent({ name: studentData[t].name, phone: studentData[t].phone, enrolledDate: studentData[t].enrolledDate });
        getStatus(studentData[t].lastPayment, studentData[t].enrolledDate);
        let total = 0, temp = [];
        const result = studentData[t].enrolledClass;
        result.forEach((d) => {
            temp.push({
                name: classData[d].name,
                fee: classData[d].fee,
                tutorName: tutorData[classData[d].tutorId].name,
                tutorId: classData[d].tutorId,
                tutorPercentage: classData[d].tutorPercentage,
                id: d
            })
            total += classData[d].fee;
        })
        setEnrolledClasses(temp);
        setTotal(total);
        setIsLoading(false)
    }

    const updateStudentData = () => {
        const ref = firestore().collection("User").doc(userData.uid).collection("Student").doc(id);
        const temp = [{ fieldName: "Name", fieldValue: "name", keyboardType: "default" }, { fieldName: "Phone", fieldValue: "phone", keyboardType: "phone-pad" }];
        const obj = { name: student.name, phone: student.phone };
        navigation.navigate("Update", { data: obj, ref, value: temp });
    }

    useEffect(() => {
        const mode = route.params.mode;
        if (mode === "Camera") {
            setCamera(true);
        } else {
            getData(route.params.id);
        }
    }, [route])

    useEffect(() => {
        if (userData?.isSmsEnabled && userData?.msgCount === 0) {
            DropDownHolder.dropDown.alertWithType("error", "SMS will not be send", "Please reload your SMS balance!");
        }
    }, [userData])

    useEffect(() => {

    }, [studentData, tutorData, classData])

    if (isLoading) {
        return (
            <SafeAreaView style={{ backgroundColor: color.white0, flex: 1, alignItems: "center", justifyContent: "center" }}>
                <ActivityIndicator color={color.blue0} size="large" />
            </SafeAreaView>
        )
    } else if (camera) {
        return (
            <SafeAreaView style={styles.container}>
                <CameraScreen
                    scanBarcode={true}
                    onReadCode={(event) => { getData(event.nativeEvent.codeStringValue) }}
                    showFrame={true}
                    laserColor={color.red1}
                    frameColor={color.blue0}
                />
            </SafeAreaView>
        )
    } else {
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    <NavBar text="Back" onPress={() => { navigation.goBack() }} />

                    <Image style={{ width: wp("50%"), height: wp("50%"), alignSelf: "center" }} source={require("../../assets/images/payment.png")} />

                    <View style={{ flexDirection: "row", justifyContent: "space-between", width: wp("90%"), marginTop: hp("2%"), alignSelf: "center" }}>
                        <Text style={styles.title0}>Payment for class</Text>
                        <TouchableOpacity onPress={() => { navigation.navigate("CustomPayment", { id }) }}>
                            <Icon name="add-circle-outline" type="ionicon" size={wp("7%")} />
                        </TouchableOpacity>
                    </View>

                    <View style={{ marginTop: hp("2%") }}>
                        <TransItem onLongPress={updateStudentData} onPress={() => { actionSheetRef.current.show() }} name={student.name} date={student.phone} isMoney={false} text={`Enrolled on ${new Date(student.enrolledDate).toLocaleDateString("en-GB")}`} text1={studentData[id].lastPayment} />
                    </View>

                    <View style={{ marginTop: hp("2%"), padding: wp("4%"), width: wp("90%"), backgroundColor: color.white1, borderRadius: 12, alignSelf: "center" }}>
                        <FlashList
                            data={enrolledClasses}
                            renderItem={({ item }) => <Subject text1={item.name} text2={item.tutorName} text3={`${item.fee} Rs`} />}
                            keyExtractor={(item) => item.id}
                            estimatedItemSize={hp("10%")}
                        />

                        <View>
                            <Subject text1="Months un-paid" text2="" text3={months} />
                            <TouchableOpacity onPress={() => { setShowMonth(!showMonth) }}>
                                <Subject text1="Months paying" text2="" text3={currentMonths} />
                            </TouchableOpacity>
                            {
                                showMonth &&
                                (
                                    <NumericInput onPlusPress={() => {
                                        setCurrentMonths((m) => ++m)
                                    }} onMinusPlus={() => {
                                        if (currentMonths - 1 > 0) {
                                            setCurrentMonths((m) => --m)
                                        }
                                    }} value={currentMonths} />
                                )
                            }
                            <Subject text1="Total" isTotal={true} text2="" text3={`${total * currentMonths} Rs`} />
                        </View>

                    </View>

                    <Printer data={{ enrolledClasses, studentData, amount: total * currentMonths }} />

                    <Button onPress={payFee} style={{ marginTop: hp("5%") }} text="Pay" />

                    <ActionSheet headerAlwaysVisible={true} ref={actionSheetRef}>
                        <Card value={id} img={userData.img} text1={student.name} text2={userData.name} />
                    </ActionSheet>

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
    }
});

export default PaymentScreen;