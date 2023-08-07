import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SearchBar } from '@rneui/base';
import { color, font } from "../utils/theme";

const CustomSearchBar = ({ onChangeText, value }) => {
    return (
        <SearchBar
            placeholder="Type to search ..."
            onChangeText={onChangeText}
            value={value}
            containerStyle={styles.searchStyle}
            inputContainerStyle={styles.searchInside}
            inputStyle={styles.searchInput}
            placeholderTextColor={color.grey0}
            selectionColor={color.black0}
        />
    )
}

const styles = StyleSheet.create({
    searchStyle: {
        backgroundColor: color.white0,
        borderColor: color.white0,
        width: wp("95%"),
        alignSelf: "center",
        marginTop: hp("3%"),
        marginBottom: hp("2%"),
        borderBottomColor: "transparent",
        borderTopColor: "transparent"
    },
    searchInside: {
        backgroundColor: color.grey1,
        borderRadius: 12,
    },
    searchInput: {
        color: color.black0,
        fontFamily: font.semibold,
        fontSize: wp("4%")
    },
})

export default CustomSearchBar;