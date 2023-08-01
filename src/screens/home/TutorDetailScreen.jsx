import { useEffect, useState } from "react";
import { StyleSheet, View, SafeAreaView, Text } from "react-native";
import { color, font } from "../../utils/theme";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useSelector } from "react-redux";
import { FlashList } from "@shopify/flash-list";
import Loader from "../../components/Loader";
import SearchBar from "../../components/SearchBar";
import TransItem from "../../components/TransItem";

const TutorDetailScreen = ({ navigation }) => {

    const [tutorList, setTutorList] = useState([]);
    const [filteredTutorList, setFilteredTutorList] = useState([]);
    const [isFilter, setIsFilter] = useState(false);
    const [text, setText] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const tutorData = useSelector((state) => state.data.tutor);

    const searchFilter = (text) => {
        let searchText = text.trim();
        const result = tutorList.filter((dataObject) => {
            let newData = dataObject.name.toUpperCase();
            let newSearchData = searchText.toUpperCase();
            let index = newData.indexOf(newSearchData);
            if (index !== -1 && index < 1) {
                return true;
            } else {
                return false;
            }
        })
        setFilteredTutorList(result);
    }

    const getTutorList = async () => {
        setIsLoading(true);
        const temp = Object.values(tutorData).map((val) => val);
        setTutorList(temp);
        setIsLoading(false);
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
        getTutorList();
    }, [tutorData])

    if (isLoading) {
        return (
            <Loader />
        )
    } else {
        return (
            <SafeAreaView style={{ backgroundColor: color.white0, flex: 1 }}>

                <Text style={styles.title0}>Tutors</Text>

                <SearchBar onChangeText={onSearch} value={text} />

                {
                    !isFilter ?
                        (
                            <FlashList
                                data={tutorList}
                                renderItem={({ item }) => <TransItem onPress={() => { navigation.navigate("Tutor", { id: item.id }) }} isMoney={true} name={item.name} value={`${item.amount} Rs`} date={item.lastPayment !== null ? new Date(item.lastPayment).toLocaleDateString("en-GB") : ""} />}
                                keyExtractor={(item) => item.id}
                                estimatedItemSize={500}
                            />
                        )
                        : (
                            <FlashList
                                data={filteredTutorList}
                                renderItem={({ item }) => <TransItem onPress={() => { navigation.navigate("Tutor", { id: item.id }) }} isMoney={true} name={item.name} value={`${item.amount} Rs`} date={item.lastPayment !== null ? new Date(item.lastPayment).toLocaleDateString("en-GB") : ""} />}
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
        fontFamily: font.bold,
        marginTop: hp("5%"),
        marginLeft: wp("5%")
    },
})

export default TutorDetailScreen;