import { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, StatusBar, FlatList } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import firestore from '@react-native-firebase/firestore';
import { color, font } from '../../utils/theme';
import NavBar from '../../components/NavBar';
import Loader from '../../components/Loader';
import { useSelector } from "react-redux";
import TransItem from '../../components/TransItem';
import { FlashList } from "@shopify/flash-list";
import { MONTH } from '../../utils/constants';
import TransMoney from '../../components/TransMoney';
import PickerTwo from '../../components/PickerTwo';

const TransactionScreen = ({ navigation }) => {

    const userData = useSelector((state) => state.user.data);

    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState([]);
    const [initialData, setInitialData] = useState([]);
    const [initialValue, setInitialValue] = useState(0);
    const [total, setTotal] = useState(0);
    const [month, setMonth] = useState(new Date().getMonth());

    const getData = async () => {
        setIsLoading(true);
        const result = await firestore().collection("User").doc(userData.uid).collection("Transaction").orderBy("date", "desc").get();
        const temp = [];
        let t = 0;
        result.forEach((d) => {
            let da = d.data();
            t += parseInt(da.value);
            temp.push(da);
        })
        setData(temp);
        setInitialData(temp);
        setTotal(t);
        setInitialValue(t);
        setIsLoading(false);
    }

    const updateList = (m) => {
        setIsLoading(true);
        let t = 0, temp = [];
        if (m !== undefined) {
            temp = initialData.filter((e) => {
                if (new Date(e.date).getMonth() === m) {
                    t += parseInt(e.value);
                    return true;
                }
                return false;
            })
        } else {
            temp = initialData;
            t = initialValue;
        }
        setTotal(t);
        setData(temp);
        setIsLoading(false);
    }

    useEffect(() => {
        getData();
    }, [userData])

    if (isLoading) {
        return (
            <Loader />
        )
    } else {
        return (
            <SafeAreaView style={styles.container}>
                <NavBar text="Back" onPress={() => { navigation.goBack() }} />

                <View style={styles.titleContainer}>
                    <Text style={styles.title0}>Transactions</Text>
                    <PickerTwo customStyle={{ height: hp("5%"), width: wp("42%"), marginRight: wp("5%") }} placeholder="Filter by month" data={MONTH} onChangeValue={(m) => { updateList(m.value) }} />
                </View>

                <TransMoney text1={total} status={true} />

                <View style={{ marginTop: hp("2%"), flex: 1 }}>
                    <FlashList
                        data={data}
                        renderItem={({ item }) => <TransItem isMoney={true} name={item.name} value={`${item.value} Rs`} date={new Date(item.date).toLocaleDateString("en-GB")} />}
                        keyExtractor={(item) => item.id}
                        estimatedItemSize={hp("10%")}
                        contentContainerStyle={{ paddingBottom: hp("10%") }}
                    />
                </View>

                <StatusBar backgroundColor={color.blue0} />
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
        marginLeft: wp("4%")
    },
    titleContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: hp("4%"),
        marginBottom: hp("2%"),
    }
});

export default TransactionScreen;