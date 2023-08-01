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
import TransItem from "../../components/TransItem";
import { FlashList } from "@shopify/flash-list";
import uuid from 'react-native-uuid';

const TutorScreen = ({ navigation, route }) => {

    const [amount, setAmount] = useState("");
    const [id, setId] = useState("");
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const tutorData = useSelector((state) => state.data.tutor);
    const userData = useSelector((state) => state.user.data);

    const getTransactions = async (idd) => {
        setIsLoading(true);
        setId(idd);
        const result = await firestore().collection("User").doc(userData.uid).collection("Tutor").doc(idd).collection("Transaction").orderBy("createdDate", "desc").get();
        const temp = [];
        result.forEach((d) => {
            temp.push({ id: d.id, ...d.data() });
        })
        setData(temp);
        setIsLoading(false);
    }

    const onPay = async () => {
        try {
            if (Number.isNaN(parseInt(amount)) || parseInt(amount) <= 0 || parseInt(amount) > tutorData[id].amount) {
                DropDownHolder.dropDown.alertWithType("error", "Invalid amount", "Please enter a valid amount!");
                return;
            }
            setIsLoading(true);
            let transId = uuid.v4();
            const time = new Date().getTime();
            let obj = {
                createdDate: time,
                amount: parseInt(amount),
                type: "tutorSettlePayment",
            }
            const batch = firestore().batch();
            const refOne = firestore().collection("User").doc(userData.uid).collection("Tutor").doc(id);
            batch.update(refOne, { amount: firestore.FieldValue.increment(-amount), lastPayment: time });
            const refTwo = firestore().collection("User").doc(userData.uid).collection("Tutor").doc(id).collection("Transaction").doc(transId);
            batch.set(refTwo, obj);
            await batch.commit();
            setAmount("0");
            setIsLoading(false);
            getTransactions(id);
            DropDownHolder.dropDown.alertWithType("success", "Success", "Payment has been done successfully!");
        } catch (error) {
            setIsLoading(false);
            DropDownHolder.dropDown.alertWithType("error", "Operation failed", "Please restart the app and try again!");
        }
    }

    useEffect(() => {
        getTransactions(route.params.id);
    }, [route])

    useEffect(() => {

    }, [tutorData, userData])

    if (isLoading) {
        return (
            <Loader />
        )
    } else {
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    <NavBar text="Back" onPress={() => { navigation.goBack() }} />

                    <Image style={{ width: wp("50%"), height: wp("50%"), alignSelf: "center" }} source={require("../../assets/images/tutor.png")} />

                    <Text style={styles.title0}>Tutor payment</Text>

                    <Text style={styles.title1}>Remaining amount : {tutorData[id]?.amount}</Text>

                    <View style={styles.textBox}>
                        <Text style={styles.text0}>Amount</Text>
                        <Input placeholder="Enter amount value ..." keyboardType="number-pad" type="number" onChangeText={(a) => { setAmount(a) }} value={amount} />
                    </View>

                    <Button text="Pay" onPress={onPay} />

                    <View style={{ marginTop: hp("4%"), flex: 1 }}>
                        <FlashList
                            data={data}
                            renderItem={({ item }) => <TransItem isMoney={true} name={item.type === "studentPayment" ? "Student payment" : "Settle payment"} value={`${item.amount} Rs`} date={new Date(item.createdDate).toLocaleDateString("en-GB")} />}
                            keyExtractor={(item) => item.id}
                            estimatedItemSize={hp("5%")}
                            contentContainerStyle={{ paddingBottom: hp("10%") }}
                        />
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
    title1: {
        fontSize: wp("4%"),
        color: color.black0,
        fontFamily: font.semibold,
        marginTop: hp("4%"),
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

export default TutorScreen;