import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Avatar } from '@rneui/base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { color, font } from "../utils/theme"

const Header = ({ text, img = null }) => {
    return (
        <View style={styles.mainContainer}>
            <Text style={styles.title0}>{text}</Text>
            <TouchableOpacity>
                <Avatar
                    rounded
                    size={wp("15%")}
                    containerStyle={styles.avatar}
                    source={{
                        uri: !img ? 'https://media.istockphoto.com/id/512735004/photo/portrait-of-a-young-beautiful-woman.webp?b=1&s=170667a&w=0&k=20&c=ukfWAogvEFKXYdD6OmNBYyhMf2H3Gnb1qiQnH2fRe3I=' : img,
                    }}
                />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: hp("2%"),
        marginBottom: hp("2%"),
        width: wp("90%"),
        alignSelf: "center",
        alignItems: "center",
    },
    title0: {
        fontSize: wp("5%"),
        color: color.white1,
        fontFamily: font.semibold,
        width: wp("60%")
    },
})

export default Header;