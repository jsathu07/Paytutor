import { useState, useEffect } from "react";
import { SafeAreaView, StyleSheet, View, Text, StatusBar, Image, ScrollView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import firestore from '@react-native-firebase/firestore';
import Button from "../../components/Button";
import { useSelector } from "react-redux";
import Input from "../../components/Input";
import DropDownHolder from "../../utils/Dropdown";
import { color, font } from '../../utils/theme';
import NavBar from "../../components/NavBar";
import Loader from "../../components/Loader";
import uuid from 'react-native-uuid';

const CustomPaymentScreen = ({ navigation, route }) => {

    const [name, setName] = useState("");
    const [fee, setFee] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [id, setId] = useState("");

    const userData = useSelector((state) => state.user.data);
    const studentData = useSelector((state) => state.student.data);

    const onPay = async () => {
        try {
            if (name === "" || parseInt(fee) <= 0) {
                DropDownHolder.dropDown.alertWithType("error", "Missing details", "Please enter all details!");
                return;
            }
            setIsLoading(true);
            let transId = uuid.v4();
            let obj = {
                date: new Date().getTime(),
                name: studentData[id].name,
                id: transId,
                studentId: id,
                value: parseInt(fee),
                type: "custom",
            }
            await firestore().collection("User").doc(userData.uid).collection("Student").doc(id).collection("Transaction").doc(transId).set(obj)
            await firestore().collection("User").doc(userData.uid).collection("Transaction").doc(transId).set(obj);
            setName("");
            setFee("");
            setIsLoading(false);
            DropDownHolder.dropDown.alertWithType("success", "Success", "Payment has been done successfully!");
        } catch (error) {
            setIsLoading(false);
            DropDownHolder.dropDown.alertWithType("error", "Operation failed", "Please restart the app and try again!");
        }
    }

    useEffect(() => {
        setId(route.params.id);
    }, [route])

    useEffect(() => {

    }, [userData, studentData])

    if (isLoading) {
        return (
            <Loader />
        )
    } else {
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    <View>
                        <NavBar text="Back" onPress={() => { navigation.goBack() }} />

                        <Image style={{ width: wp("50%"), height: wp("50%"), alignSelf: "center" }} source={require("../../assets/images/payment.png")} />

                        <Text style={styles.title0}>Custom payment</Text>

                        <View style={styles.textBox}>
                            <Text style={styles.text0}>Name</Text>
                            <Input placeholder="Enter payment name ..." type="text" value={name} onChangeText={(name) => { setName(name) }} />
                            <Text style={styles.text0}>Fee</Text>
                            <Input placeholder="Enter payment value ..." keyboardType="number-pad" type="number" onChangeText={(fee) => { setFee(fee) }} value={fee} />
                        </View>

                        <Button text="Pay" onPress={onPay} />
                    </View>

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
        marginTop: hp("1%"),
        marginLeft: wp("7%")
    },
    textBox: {
        marginTop: hp("3%"),
        marginBottom: hp("2%"),
        alignSelf: "center"
    },
    text0: {
        fontFamily: font.regular,
        fontSize: wp("4%"),
        color: color.grey0,
    }
});

export default CustomPaymentScreen;