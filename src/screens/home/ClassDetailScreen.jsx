import { useEffect, useState } from "react";
import { StyleSheet, View, SafeAreaView, FlatList } from "react-native";
import { color, font } from "../../utils/theme";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useSelector } from "react-redux";
import firestore from '@react-native-firebase/firestore';
import { SearchBar } from '@rneui/base';
import UserItem from "../../components/UserItem";
import NavBar from "../../components/NavBar";

const ClassDetailScreen = ({ navigation, route }) => {

    const [userList, setUserList] = useState([]);
    const [filteredUserList, setFilteredUserList] = useState([]);
    const [isFilter, setIsFilter] = useState(false);
    const [text, setText] = useState("");

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

    const getData = async () => {
        const result = await firestore().collection("User").doc(userData.uid).collection("Class").doc(route.params.id).collection("Student").get();
        const temp = [];
        result.forEach((d) => {
            let status = studentData[d.id].last_payment;
            if (status !== undefined) {
                if (new Date(status).getMonth() === new Date().getMonth()) {
                    status = true;
                } else {
                    status = false;
                }
            } else {
                status = false
            }
            temp.push({
                name: studentData[d.id].name,
                status,
                id: d.id
            })
        })
        setUserList(temp);
    }

    useEffect(() => {
        getData();
    }, [route.params.id])

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

            {
                !isFilter ?
                    (
                        <FlatList
                            data={userList}
                            renderItem={({ item }) => <UserItem status={item.status} name={item.name} />}
                            keyExtractor={(item) => item.id}
                        />
                    )
                    : (
                        <FlatList
                            data={filteredUserList}
                            renderItem={({ item }) => <UserItem status={item.status} name={item.name} />}
                            keyExtractor={(item) => item.id}
                        />
                    )
            }



            <View style={{ height: hp("2%") }}></View>

        </SafeAreaView>
    )
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
        marginBottom: hp("2%")
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