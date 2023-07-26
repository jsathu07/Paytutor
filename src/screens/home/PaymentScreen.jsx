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
import uuid from 'react-native-uuid';

const PaymentScreen = ({ navigation, route }) => {

    const actionSheetRef = useRef(null);

    const [camera, setCamera] = useState(true);
    const [total, setTotal] = useState(0);
    const [enrolledClasses, setEnrolledClasses] = useState([]);
    const [status, setStatus] = useState(false);
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

    const getStatus = (s) => {
        let diff;
        if (s !== null) {
            let d = new Date(s);
            let curr = new Date();
            if (d.getFullYear() == curr.getFullYear()) {
                diff = curr.getMonth() - d.getMonth();
            } else {
                diff = 11 - d.getMonth() + curr.getMonth() + 1 + (curr.getFullYear() - d.getFullYear() - 1) * 12;
            }
        } else {
            diff = 1;
        }
        setMonths(diff);
        setCurrentMonths(diff);
        if (diff <= 0) {
            setStatus(true);
        } else {
            setStatus(false);
        }
    }

    const payFee = async () => {
        let transId = uuid.v4();
        setIsLoading(true);
        let final;
        if (studentData[id].last_payment !== null) {
            final = new Date(studentData[id].last_payment);
            final.setMonth(final.getMonth() + currentMonths);
        } else {
            final = new Date();
        }
        await firestore().collection("User").doc(userData.uid).collection("Student").doc(id)
            .update({
                last_payment: final.getTime()
            })
        let obj = {
            date: new Date().getTime(),
            name: student.name,
            id: transId,
            studentId: id,
            value: total * currentMonths
        }
        await firestore().collection("User").doc(userData.uid).collection("Student").doc(id).collection("Transaction").doc(transId).set(obj)
        await firestore().collection("User").doc(userData.uid).collection("Transaction").doc(transId).set(obj);
        getStatus(final);
        setIsLoading(false)
    }

    const getData = async (t) => {
        setIsLoading(true);
        setId(t);
        setCamera(false);
        setStudent({ name: studentData[t].name, phone: studentData[t].phone, enrolledDate: studentData[t].enrolledDate });
        getStatus(studentData[t].last_payment);
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

    }, [studentData, userData, tutorData, classData])

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

                    <Text style={styles.title0}>Payment for class</Text>

                    <View style={{ marginTop: hp("2%") }}>
                        <TransItem onPress={() => { actionSheetRef.current.show() }} name={student.name} date={student.phone} isMoney={false} text={`Enrolled on ${new Date(student.enrolledDate).toDateString()}`} text1={studentData[id]?.last_payment} />
                    </View>

                    <View style={{ marginTop: hp("2%"), padding: wp("4%"), width: wp("90%"), backgroundColor: color.white1, borderRadius: 12, alignSelf: "center" }}>
                        <FlashList
                            data={enrolledClasses}
                            renderItem={({ item }) => <Subject text1={item.name} text2={item.tutorName} text3={`${item.fee} Rs`} />}
                            keyExtractor={(item) => item.id}
                            estimatedItemSize={hp("10%")}
                        />
                        {
                            !status &&
                            (
                                <View>
                                    <Subject text1="Months un-paid" text2="" text3={months} />
                                    <TouchableOpacity onPress={() => { setShowMonth(!showMonth) }}>
                                        <Subject text1="Months paying" text2="" text3={currentMonths} />
                                    </TouchableOpacity>
                                    {
                                        showMonth &&
                                        (
                                            <NumericInput onPlusPress={() => {
                                                if (currentMonths + 1 <= months) {
                                                    setCurrentMonths((m) => ++m)
                                                }
                                            }} onMinusPlus={() => {
                                                if (currentMonths - 1 > 0) {
                                                    setCurrentMonths((m) => --m)
                                                }
                                            }} value={currentMonths} />
                                        )
                                    }
                                    <Subject text1="Total" isTotal={true} text2="" text3={`${total * currentMonths} Rs`} />
                                </View>
                            )
                        }
                    </View>

                    {
                        !status ?
                            (
                                <Button onPress={payFee} style={{ marginTop: hp("5%") }} text="Pay" />
                            )
                            :
                            (
                                null
                            )
                    }

                    <ActionSheet headerAlwaysVisible={true} ref={actionSheetRef}>
                        <Card img={userData.img} text1={student.name} text2={userData.name} />
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
        fontFamily: font.semibold,
        marginLeft: wp("7%")
    }
});

export default PaymentScreen;