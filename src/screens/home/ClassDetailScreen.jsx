import { useEffect, useState } from "react";
import { StyleSheet, View, SafeAreaView } from "react-native";
import { color, font } from "../../utils/theme";
import { MONTH } from "../../utils/constants";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useSelector } from "react-redux";
import firestore from '@react-native-firebase/firestore';
import { SearchBar } from '@rneui/base';
import UserItem from "../../components/UserItem";
import NavBar from "../../components/NavBar";
import { FlashList } from "@shopify/flash-list";
import Loader from "../../components/Loader";
import PickerTwo from "../../components/PickerTwo";

const ClassDetailScreen = ({ navigation, route }) => {

    const [userList, setUserList] = useState([]);
    const [initialList, setInitialList] = useState([]);
    const [filteredUserList, setFilteredUserList] = useState([]);
    const [isFilter, setIsFilter] = useState(false);
    const [text, setText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [currDate, setCurrDate] = useState(new Date());
    const [month, setMonth] = useState(new Date().getMonth());

    const studentData = useSelector((state) => state.student.data);
    const userData = useSelector((state) => state.user.data);

    const searchFilter = (text) => {
        let searchText = text.trim();
        const result = userList.filter((dataObject) => {
            let newData = dataObject.name.toUpperCase();
            let newSearchData = searchText.toUpperCase();
            let index = newData.indexOf(newSearchData);
            if (index !== -1 && index < 1) {
                return true;
            } else {
                return false;
            }
        })
        setFilteredUserList(result);
    }

    const getStatus = (t, e) => {
        let diff;
        let d = new Date(t !== null ? t : e);
        let curr = currDate;
        if (d.getFullYear() == curr.getFullYear()) {
            diff = curr.getMonth() - d.getMonth();
        } else {
            diff = 11 - d.getMonth() + curr.getMonth() + (curr.getFullYear() - d.getFullYear() - 1) * 12;
        }
        if (t === null) diff++;
        if (diff <= 0) {
            return true;
        }
        return false;
    }

    const updateStatus = (m) => {
        setIsLoading(true);
        let final = [];
        if (m !== undefined) {
            let x = currDate;
            x.setMonth(m);
            setCurrDate(x);
            userList.forEach((e) => {
                final.push({ ...e, status: getStatus(studentData[e.id].last_payment, studentData[e.id].enrolledDate) })
            })
        } else {
            final = initialList;
        }
        setUserList(final);
        setIsLoading(false);
    }

    const getData = async () => {
        setIsLoading(true);
        const result = await firestore().collection("User").doc(userData.uid).collection("Class").doc(route.params.id).collection("Student").get();
        const temp = [];
        result.forEach((d) => {
            let status = getStatus(studentData[d.id].last_payment, studentData[d.id].enrolledDate);
            temp.push({
                name: studentData[d.id].name,
                status,
                id: d.id
            })
        })
        setUserList(temp);
        setInitialList(temp);
        setIsLoading(false);
    }

    useEffect(() => {
        getData();
    }, [route.params.id, studentData])

    if (isLoading) {
        return (
            <Loader />
        )
    } else {
        return (
            <SafeAreaView style={{ backgroundColor: color.white0, flex: 1 }}>

                <NavBar text="Back" onPress={() => { navigation.goBack() }} />

                <SearchBar
                    placeholder="Type to search"
                    onChangeText={(searchText) => {
                        setText(searchText);
                        if (searchText) {
                            searchFilter(searchText);
                            setIsFilter(true);
                        } else {
                            setIsFilter(false);
                        }
                    }}
                    value={text}
                    containerStyle={styles.searchStyle}
                    inputContainerStyle={styles.searchInside}
                    inputStyle={styles.searchInput}
                    placeholderTextColor={color.grey0}
                    selectionColor={color.black0}
                />

                <PickerTwo customStyle={{ height: hp("5%"), width: wp("35%"), alignSelf: "flex-end", marginRight: wp("5%"), marginBottom: hp("2%") }} placeholder="Month" data={MONTH} onChangeValue={(m) => { updateStatus(m.value) }} />

                {
                    !isFilter ?
                        (
                            <FlashList
                                data={userList}
                                renderItem={({ item }) => <UserItem onPress={() => { navigation.navigate("Payment", { mode: "Normal", id: item.id }) }} status={item.status} name={item.name} />}
                                keyExtractor={(item) => item.id}
                                estimatedItemSize={500}
                            />
                        )
                        : (
                            <FlashList
                                data={filteredUserList}
                                renderItem={({ item }) => <UserItem onPress={() => { navigation.navigate("Payment", { mode: "Normal", id: item.id }) }} status={item.status} name={item.name} />}
                                keyExtractor={(item) => item.id}
                                estimatedItemSize={500}
                            />
                        )
                }

                <View style={{ height: hp("2%") }}></View>

            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    title0: {
        fontSize: wp("5%"),
        color: color.black0,
        fontFamily: font.semibold
    },
    searchStyle: {
        backgroundColor: color.white0,
        borderColor: color.white0,
        width: wp("95%"),
        alignSelf: "center",
        marginTop: hp("3%"),
    },
    searchInside: {
        backgroundColor: color.grey1,
        borderRadius: 12
    },
    searchInput: {
        color: color.black0,
        fontFamily: font.semibold,
        fontSize: wp("4%")
    },
})

export default ClassDetailScreen;