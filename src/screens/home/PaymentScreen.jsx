import { useEffect, useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, ScrollView, StatusBar, Image, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useSelector } from "react-redux";
import { CameraScreen } from 'react-native-camera-kit';
import firestore from '@react-native-firebase/firestore';
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

    const sendMessage = async (name, phone, amount) => {

        if (!userData.isSmsEnabled || userData.msgCount <= 0) {
            return;
        }

        const message = `Hi ${name}, Your payment of Rs. ${amount} for ${userData.name}'s tutoring services has been made successfully. Thanks! PayTutor Support Team`;
        const url = `https://send.lk/sms/send.php?token=1336|tf0xhH3mh5K9tBOrdGA30gQcg1QvwlC7HMEpNYm6&to=${phone}&from=SendTest&message=${message}`;

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        }

        try {
            const response = await fetch(url, requestOptions);
            if (response.ok) {
                await firestore().collection("User").doc(userData.uid).update({ msgCount: firestore.FieldValue.increment(-1) })
            }
        } catch (error) {

        }

    }

    const payFee = async () => {
        if (currentMonths <= 0) {
            return;
        }
        try {
            let transId = uuid.v4();
            setIsLoading(true);
            let final;
            if (studentData[id].last_payment !== null) {
                final = new Date(studentData[id].last_payment);
                final.setMonth(final.getMonth() + currentMonths);
            } else {
                final = new Date(studentData[id].enrolledDate);
                final.setMonth(final.getMonth() + currentMonths - 1);
            }
            const batch = firestore().batch();
            const stdRef = firestore().collection("User").doc(userData.uid).collection("Student").doc(id)
            batch.update(stdRef, { last_payment: final.getTime() })
            let obj = {
                date: new Date().getTime(),
                name: student.name,
                id: transId,
                studentId: id,
                value: total * currentMonths,
                type: "payment"
            }
            const stdTransRef = firestore().collection("User").doc(userData.uid).collection("Student").doc(id).collection("Transaction").doc(transId);
            batch.set(stdTransRef, obj);
            const transRef = firestore().collection("User").doc(userData.uid).collection("Transaction").doc(transId);
            batch.set(transRef, obj);
            const userRef = firestore().collection("User").doc(userData.uid);
            batch.update(userRef, { transCount: firestore.FieldValue.increment(1) });
            await batch.commit();
            sendMessage(student.name, student.phone, total * currentMonths);
            getStatus(final, studentData[id].enrolledDate);
            setIsLoading(false);
            DropDownHolder.dropDown.alertWithType("success", "Success", "Payment has been made successfully!");
        } catch (error) {

        }
    }

    const getData = async (t) => {
        setIsLoading(true);
        setId(t);
        setCamera(false);
        setStudent({ name: studentData[t].name, phone: studentData[t].phone, enrolledDate: studentData[t].enrolledDate });
        getStatus(studentData[t].last_payment, studentData[t].enrolledDate);
        const result = await firestore().collection("User").doc(userData.uid).collection("Student").doc(t).collection("EnrolledClass").get();
        let total = 0, temp = [];
        result.forEach((d) => {
            temp.push({
                name: classData[d.id].name,
                fee: classData[d.id].fee,
                tutorName: tutorData[classData[d.id].tutor].name,
                id: d.id
            })
            total += classData[d.id].fee;
        })
        setEnrolledClasses(temp);
        setTotal(total);
        setIsLoading(false)
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
                        <TransItem onPress={() => { actionSheetRef.current.show() }} name={student.name} date={student.phone} isMoney={false} text={`Enrolled on ${new Date(student.enrolledDate).toLocaleDateString("en-GB")}`} text1={studentData[id].last_payment} />
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