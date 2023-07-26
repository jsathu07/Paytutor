import React, { useEffect, useState } from "react";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import DropDownPicker from 'react-native-dropdown-picker';
import { color, font } from '../utils/theme'

const CustomPicker = ({ data, onChangeValue, max, placeholder, onClose, onOpen }) => {

    const [open, setOpen] = useState(false);
    const [items, setItems] = useState([]);
    const [value, setValue] = useState([]);

    useEffect(() => {
        setItems(data);
    }, [data])

    return (
        <DropDownPicker
            style={{ marginTop: hp("1%"), height: hp("7%"), width: wp("85%"), alignSelf: "center", borderRadius: 12, borderColor: color.grey1, borderWidth: 2 }}
            open={open}
            value={value}
            max={max}
            placeholder={placeholder}
            placeholderStyle={{ color: color.grey0, fontFamily: font.semibold }}
            textStyle={{ color: color.black0, fontFamily: font.semibold }}
            dropDownDirection="TOP"
            dropDownContainerStyle={{ borderColor: color.grey1, width: wp("85%"), alignSelf: "center", borderWidth: 2 }}
            showArrowIcon={true}
            showTickIcon={true}
            multiple={true}
            items={items}
            mode="BADGE"
            setValue={setValue}
            setOpen={setOpen}
            setItems={setItems}
            onClose={onClose}
            onOpen={onOpen}
            onChangeValue={onChangeValue}
        />
    )
}

export default CustomPicker;