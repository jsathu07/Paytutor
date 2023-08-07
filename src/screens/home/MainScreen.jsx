import { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Icon } from '@rneui/base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { color, font } from '../../utils/theme';
import { useDispatch } from "react-redux";
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import HomeScreen from './HomeScreen';
import ClassScreen from './ClassScreen';
import RegistrationScreen from './RegistrationScreen';
import TutorDetailScreen from './TutorDetailScreen';
import SettingsScreen from './SettingsScreen';
import AdminScreen from './AdminScreen';

import { getData } from '../../store/data';
import { getStudent } from '../../store/student';
import { getTransactions } from '../../store/trans';
import { getUser } from '../../store/user';

const Tab = createBottomTabNavigator();
const StackTwo = createNativeStackNavigator();

const MainScreen = () => {

    const [isAdmin, setIsAdmin] = useState(false);

    const dispatch = useDispatch();

    const fetchData = async () => {
        let uid = auth().currentUser.uid;
        const e = await auth().currentUser.getIdTokenResult(true);
        const isAdmin = e.claims.admin === true;
        if (isAdmin) {
            const result = await firestore().collection("Admin").doc(uid).collection("Organization").get();
            result.forEach((e) => {
                console.log(e.id, e.data());
                uid = e.id;
            })
            setIsAdmin(false);
            // return;
        }
        firestore().collection("User").doc(uid)
            .onSnapshot((d) => {
                dispatch(getUser({ ...d.data(), isAdmin }))
            })
        let temp2 = {};
        firestore().collection("User").doc(uid).collection("Tutor")
            .onSnapshot((val) => {
                temp2 = {};
                val.forEach((d) => {
                    temp2[d.id] = { id: d.id, ...d.data() }
                })
                dispatch(getData({ type: "tutor", data: temp2 }));
            })
        let temp = {};
        firestore().collection("User").doc(uid).collection("Class")
            .onSnapshot((val) => {
                temp = {};
                val.forEach((d) => {
                    temp[d.id] = { id: d.id, ...d.data() }
                })
                dispatch(getData({ type: "classData", data: temp }));
            })
        let trans = [];
        firestore().collection("User").doc(uid).collection("Transaction").orderBy("createdDate", "desc").limit(5)
            .onSnapshot((val) => {
                trans = [];
                val.forEach((d) => {
                    trans.push(d.data());
                })
                dispatch(getTransactions(trans));
            })
        let stu = {};
        firestore().collection("User").doc(uid).collection("Student")
            .onSnapshot((val) => {
                stu = {};
                val.forEach((d) => {
                    stu[d.id] = { id: d.id, ...d.data() }
                })
                dispatch(getStudent(stu));
            })
    }

    useEffect(() => {
        fetchData();
    }, [])

    if (!isAdmin) {
        return (
            <Tab.Navigator
                initialRouteName="Home"
                screenOptions={({ route }) => ({
                    headerShown: false,
                    tabBarShowLabel: false,
                    tabBarHideOnKeyboard: true,
                    tabBarActiveTintColor: color.blue0,
                    tabBarLabelStyle: {
                        fontFamily: font.bold,
                        fontSize: wp("3%")
                    },
                    tabBarInactiveTintColor: color.grey0,
                    tabBarStyle: {
                        backgroundColor: color.white0,
                        elevation: 0,
                        borderColor: color.white0
                    },
                    tabBarIcon: ({ focused }) => {
                        let iconName;
                        if (route.name === "Home") {
                            iconName = "home-outline";
                        } else if (route.name === "Class") {
                            iconName = "list-outline"
                        } else if (route.name === "Settings") {
                            iconName = "settings-outline"
                        } else if (route.name === "TutorDetails") {
                            iconName = "man-outline"
                        } else {
                            iconName = "person-add-outline"
                        }
                        return <Icon size={wp("7%")} name={iconName} color={focused ? color.blue0 : color.grey0} type="ionicon" />
                    }
                })}
            >
                <Tab.Screen name="Home" component={HomeScreen} />
                <Tab.Screen name="Class" component={ClassScreen} />
                <Tab.Screen name="Register" component={RegistrationScreen} />
                <Tab.Screen name="TutorDetails" component={TutorDetailScreen} />
                <Tab.Screen name="Settings" component={SettingsScreen} />
            </Tab.Navigator>
        )
    } else {
        return (
            <StackTwo.Navigator screenOptions={{ headerShown: false }} initialRouteName="Admin">
                <StackTwo.Screen name="Admin" component={AdminScreen} />
            </StackTwo.Navigator>
        )
    }
}

export default MainScreen;