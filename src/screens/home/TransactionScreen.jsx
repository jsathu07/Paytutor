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

const TransactionScreen = ({ navigation }) => {

    const userData = useSelector((state) => state.user.data);

    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState([]);

    const getData = async () => {
        setIsLoading(true);
        const result = await firestore().collection("User").doc(userData.uid).collection("Transaction").orderBy("date", "desc").get();
        const temp = [];
        result.forEach((d) => {
            temp.push(d.data());
        })
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

                <Text style={styles.title0}>Transactions</Text>

                <FlashList
                    data={data}
                    renderItem={({ item }) => <TransItem isMoney={true} name={item.name} value={`${item.value} Rs`} date={new Date(item.date).toLocaleDateString("en-GB")} />}
                    keyExtractor={(item) => item.id}
                    estimatedItemSize={hp("10%")}
                    contentContainerStyle={{ paddingBottom: hp("10%") }}
                />

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
        marginLeft: wp("7%"),
        marginTop: hp("4%"),
        marginBottom: hp("2%")
    }
});

export default TransactionScreen;