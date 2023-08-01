import { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, ScrollView, StatusBar, FlatList, Image } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { color, font } from '../../utils/theme';
import Loader from '../../components/Loader';
import Input from '../../components/Input';
import Button from '../../components/Button';
import NavBar from '../../components/NavBar';

const UpdateScreen = ({ navigation, route }) => {

    const [isLoading, setIsLoading] = useState(false);
    const [value, setValue] = useState([]);
    const [data, setData] = useState(null);
    const [ref, setRef] = useState(null);

    const updateData = async () => {
        setIsLoading(true);
        //trim name and phone
        ref.update(data);
        setIsLoading(false);
        navigation.navigate("Main");
    }

    useEffect(() => {
        setData({ ...route.params.data });
        setRef(route.params.ref);
        setValue([...route.params.value]);
    }, [route])

    if (isLoading) {
        return (
            <Loader />
        )
    } else {
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    <NavBar text="Back" onPress={() => { navigation.goBack() }} />

                    <Image style={{ width: wp("75%"), height: wp("50%"), alignSelf: "center" }} source={require("../../assets/images/edit.png")} />

                    <Text style={styles.mainTitle}>Update data</Text>

                    <FlatList
                        data={value}
                        renderItem={({ item }) => {
                            const t = item.fieldValue;
                            return (
                                <View style={{ alignSelf: "center" }}>
                                    <Text style={styles.text0}>{item.fieldName}</Text>
                                    <Input value={data[t]} keyboardType={item.keyboardType} onChangeText={(text) => { setData((data) => { return { ...data, [t]: text } }) }} />
                                </View>
                            )
                        }}
                        keyExtractor={(item) => item.fieldValue}
                    />

                    <Button style={{ marginTop: hp("5%") }} text="Update" onPress={updateData} />

                    <View style={{ height: hp("5%") }}></View>

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
    mainTitle: {
        fontFamily: font.bold,
        fontSize: wp("5%"),
        color: color.black0,
        marginLeft: wp("7%"),
        marginTop: hp("2%"),
        marginBottom: hp("5%")
    },
    text0: {
        fontFamily: font.regular,
        fontSize: wp("4%"),
        color: color.grey0,
    }
})

export default UpdateScreen;