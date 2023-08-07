import { StyleSheet, SafeAreaView, ActivityIndicator, StatusBar } from 'react-native';
import { color } from "../utils/theme"

const Loader = () => {
    return (
        <SafeAreaView style={{ backgroundColor: color.white0, flex: 1, alignItems: "center", justifyContent: "center" }}>
            <ActivityIndicator color={color.blue0} size="large" />
            <StatusBar backgroundColor={color.blue0} />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({

})

export default Loader;