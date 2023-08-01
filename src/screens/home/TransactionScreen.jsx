import { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, StatusBar, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import firestore from '@react-native-firebase/firestore';
import { color, font } from '../../utils/theme';
import NavBar from '../../components/NavBar';
import Loader from '../../components/Loader';
import { useSelector } from "react-redux";
import TransItem from '../../components/TransItem';
import { FlashList } from "@shopify/flash-list";
import TransMoney from '../../components/TransMoney';
import DatePicker from '../../components/DatePicker';
import { Icon } from '@rneui/base';
import Button from '../../components/Button';

const TransactionScreen = ({ navigation }) => {

    const userData = useSelector((state) => state.user.data);
    const studentData = useSelector((state) => state.student.data);

    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [showFilter, setShowFilter] = useState(false);
    const [initialDate, setInitialDate] = useState(new Date());
    const [finalDate, setFinalDate] = useState(new Date());

    const getData = async () => {
        setIsLoading(true);
        const result = await firestore().collection("User").doc(userData.uid).collection("Transaction").orderBy("createdDate", "desc").get();
        const temp = [];
        let t = 0;
        result.forEach((d) => {
            let da = d.data();
            t += parseInt(da.value);
            temp.push(da);
        })
        setData(temp);
        setTotal(t);
        setShowFilter(false);
        setIsLoading(false);
    }

    const updateList = async () => {
        setIsLoading(true);
        initialDate.setHours(0); initialDate.setMinutes(0); initialDate.setSeconds(0); initialDate.setMilliseconds(0);
        finalDate.setHours(23); finalDate.setMinutes(59); finalDate.setSeconds(59); finalDate.setMilliseconds(999);
        const result = await firestore().collection("User").doc(userData.uid).collection("Transaction").where("createdDate", ">=", initialDate.getTime()).where("createdDate", "<=", finalDate.getTime()).orderBy("createdDate", "desc").get();
        if (result.size === 0) {
            setData([]);
            setTotal(0);
            setIsLoading(false);
            setShowFilter(false);
            return;
        }
        const temp = [];
        let t = 0;
        result.forEach((d) => {
            let da = d.data();
            t += parseInt(da.value);
            temp.push(da);
        });
        setData(temp);
        setTotal(t);
        setShowFilter(false);
        setIsLoading(false);
    }

    useEffect(() => {
        getData();
    }, [userData, studentData])

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
                    <TouchableOpacity onPress={() => { setShowFilter(!showFilter) }}>
                        <Icon name="filter-circle-outline" type="ionicon" size={wp("7%")} style={{ marginRight: wp("5%") }} />
                    </TouchableOpacity>
                </View>

                {
                    !showFilter &&
                    (
                        <View style={{ flex: 1 }}>
                            <TransMoney text1={total} status={true} />

                            <View style={{ marginTop: hp("2%"), flex: 1 }}>
                                <FlashList
                                    data={data}
                                    renderItem={({ item }) => <TransItem isMoney={true} name={studentData[item.studentId].name} value={`${item.value} Rs`} date={new Date(item.createdDate).toLocaleDateString("en-GB")} />}
                                    keyExtractor={(item) => item.id}
                                    estimatedItemSize={hp("10%")}
                                    contentContainerStyle={{ paddingBottom: hp("10%") }}
                                />
                            </View>
                        </View>
                    )
                }

                {
                    showFilter &&
                    (
                        <View style={styles.filterContainer}>
                            <Text style={styles.filterText}>Date</Text>
                            <View style={styles.filterDateContainer}>
                                <DatePicker value={initialDate} onConfirm={(date) => { setInitialDate(date) }} />
                                <Text style={styles.reset}>-</Text>
                                <DatePicker value={finalDate} onConfirm={(date) => { setFinalDate(date) }} />
                            </View>
                            <View style={styles.filterInnerContainer}>
                                <TouchableOpacity onPress={getData}>
                                    <Text style={styles.reset}>Reset all filters</Text>
                                </TouchableOpacity>
                                <Button style={{ marginTop: hp("0%"), width: wp("35%"), height: hp("6%") }} onPress={updateList} text="Apply Filters" />
                            </View>
                        </View>
                    )
                }

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
    },
    filterContainer: {
        alignSelf: "center",
        width: wp("90%"),
    },
    filterText: {
        fontSize: wp("4%"),
        color: color.black0,
        fontFamily: font.semibold,
        marginTop: hp("2%"),
    },
    filterInnerContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: hp("4%"),
    },
    filterDateContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: hp("2%")
    },
    reset: {
        fontSize: wp("4%"),
        color: color.grey0,
        fontFamily: font.semibold,
    }
});

export default TransactionScreen;