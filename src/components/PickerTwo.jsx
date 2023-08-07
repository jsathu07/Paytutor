import { useEffect, useState } from "react";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Dropdown } from 'react-native-element-dropdown';
import { color, font } from '../utils/theme';

const CustomPickerTwo = ({ data, onChangeValue, placeholder, customStyle = {} }) => {

    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);

    return (
        <Dropdown
            labelField="label"
            valueField="value"
            style={[{ height: hp("8%"), width: wp("85%"), marginTop: hp("1%"), borderRadius: 12, borderColor: color.grey1, borderWidth: 2, alignSelf: "center" }, customStyle, isFocus && { borderColor: color.blue0 }]}
            value={value}
            data={data}
            placeholder={placeholder}
            placeholderStyle={{ color: color.grey0, fontFamily: font.semibold, fontSize: wp("4%"), textAlign: "center" }}
            itemTextStyle={{ color: color.black0, fontFamily: font.semibold, fontSize: wp("4%") }}
            selectedTextStyle={{ color: color.black0, fontFamily: font.semibold, fontSize: wp("4%"), marginLeft: wp("4%") }}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={onChangeValue}
        />
    )
}

export default CustomPickerTwo;