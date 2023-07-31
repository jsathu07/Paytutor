import { useEffect, useState } from "react";
import { StyleSheet, View, SafeAreaView, Text, TouchableOpacity, FlatList, StatusBar } from "react-native";
import { color, font } from "../../utils/theme";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useSelector } from "react-redux";
import {  Icon } from '@rneui/base';
import TransItem from "../../components/TransItem";
import { FlashList } from "@shopify/flash-list";
import Loader from "../../components/Loader";
import SearchBar from "../../components/SearchBar";

const ClassScreen = ({ navigation }) => {

    const [classList, setClassList] = useState([]);
    const [filteredClassList, setFilteredClassList] = useState([]);
    const [isFilter, setIsFilter] = useState(false);
    const [text, setText] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const classData = useSelector((state) => state.data.data);
    const tutorData = useSelector((state) => state.data.tutor);

    const getClassList = async () => {
        setIsLoading(true);
        const temp = Object.values(classData).map((val) => val);
        setClassList(temp);
        setIsLoading(false);
    }

    const searchFilter = (text) => {
        let searchText = text.trim();
        const result = classList.filter((dataObject) => {
            let newData = dataObject.name.toUpperCase();
            let newSearchData = searchText.toUpperCase();
            let index = newData.indexOf(newSearchData);
            if (index !== -1 && index < 1) {
                return true;
            } else {
                return false;
            }
        })
        setFilteredClassList(result);
    }

    const onSearch = (searchText) => {
        setText(searchText);
        if (searchText) {
            searchFilter(searchText);
            setIsFilter(true);
        } else {
            setIsFilter(false);
        }
    }

    useEffect(() => {
        getClassList();
    }, [classData, tutorData])

    if (isLoading) {
        return (
            <Loader />
        )
    } else {
        return (
            <SafeAreaView style={{ backgroundColor: color.white0, flex: 1 }}>

                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", alignSelf: "center", width: wp("90%"), marginTop: hp("5%") }}>
                    <Text style={styles.title0}>Classes</Text>
                    <TouchableOpacity onPress={() => { navigation.navigate("ClassRegister") }}>
                        <Icon type="ionicon" name="add-outline" size={wp("7%")} />
                    </TouchableOpacity>
                </View>

                <SearchBar value={text} onChangeText={onSearch} />

                {
                    !isFilter ?
                        (
                            <FlashList
                                data={classList}
                                renderItem={({ item }) => (
                                    <TransItem onPress={() => { navigation.navigate("ClassDetail", { id: item.id }) }} isMoney={false} isUser={true} value={item.count} name={item.name} date={tutorData[item.tutor].name} />
                                )}
                                keyExtractor={(item) => item.id}
                                estimatedItemSize={hp("8%")}
                            />
                        )
                        :
                        (
                            <FlashList
                                data={filteredClassList}
                                renderItem={({ item }) => (
                                    <TransItem onPress={() => { navigation.navigate("ClassDetail", { id: item.id }) }} isMoney={false} isUser={true} value={item.count} name={item.name} date={tutorData[item.tutor].name} />
                                )}
                                keyExtractor={(item) => item.id}
                                estimatedItemSize={hp("8%")}
                            />
                        )
                }

                <View style={{ height: hp("2%") }}></View>

                <StatusBar backgroundColor={color.blue0} />
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    title0: {
        fontSize: wp("5%"),
        color: color.black0,
        fontFamily: font.bold
    },
})

export default ClassScreen;


