import { useEffect, useState } from "react";
import { StatusBar, View, StyleSheet, Text, TouchableOpacity, FlatList, SafeAreaView, Image } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useSelector } from "react-redux";
import Header from "../../components/Header";
import { FAB } from '@rneui/base';
import { color, font } from "../../utils/theme";
import TransItem from "../../components/TransItem";

const HomeScreen = ({ navigation }) => {

    const [transList, setTransList] = useState([]);

    const transData = useSelector((state) => state.trans.data);
    const userData = useSelector((state) => state.user.data);

    useEffect(() => {
        setTransList(transData);
    }, [transData, userData])

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topContainer}>
                <Header img={userData !== undefined ? userData.img : ""} text={userData !== undefined ? userData.name : ""} />
                <Image style={{ width: wp("60%"), height: wp("20%") }} source={require("../../../logo.png")} />
            </View>
            <View style={styles.bottomContainer}>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>Recent transactions</Text>
                    <TouchableOpacity onPress={() => { navigation.navigate("Transaction") }}>
                        <Text style={styles.subtitle}>Show all</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ marginTop: hp("3%") }}>
                    <FlatList
                        data={transList}
                        renderItem={({ item }) => <TransItem isMoney={true} name={item.name} value={item.value} date={new Date(item.date).toDateString()} />}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={{ paddingBottom: hp("10%") }}
                    />
                </View>

                <FAB
                    visible={true}
                    placement="right"
                    icon={{ type: "ionicon", name: "scan-outline", color: color.white0 }}
                    size="large"
                    onPress={() => { navigation.navigate("Payment", { mode: "Camera", id: "" }) }}
                    iconContainerStyle={{ backgroundColor: color.blue0 }}
                />
            </View>
            <StatusBar backgroundColor={color.blue0} />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.blue0
    },
    topContainer: {
        backgroundColor: color.blue0,
        alignItems: "center",
        paddingBottom: hp("5%")
    },
    bottomContainer: {
        flex: 1.5,
        backgroundColor: color.white0
    },
    textContainer: {
        flexDirection: "row",
        marginTop: hp("5%"),
        alignItems: "center",
        justifyContent: "space-between",
        width: wp("90%"),
        alignSelf: "center"
    },
    title: {
        fontFamily: font.semibold,
        color: color.black0,
        fontSize: wp("4.5%")
    },
    subtitle: {
        fontFamily: font.semibold,
        color: color.grey0,
        fontSize: wp("4%")
    }
})

export default HomeScreen;