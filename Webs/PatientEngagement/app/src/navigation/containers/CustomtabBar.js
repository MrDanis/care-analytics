/* istanbul ignore file */
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import Colors from '../../../config/Colors';
import { Text, TouchableOpacity, View } from 'react-native';
import {
    heightPercentageToDP,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import ShareHistory from '../../features/bluebutton/screens/ShareHistory';
// import CalenderIcon from '../../../../assets/svg/icon_today.svg';
// import RxIcon from '../../../../assets/svg/icon_prescription.svg';
import { Fonts } from '../../../config/AppConfig';
import { NearPharmacies } from '../../features/medication/screens/goodRx/NearPharmacies';
import MedicationScreen from '../../features/bluebutton/screens/Medication/MedicationScreen';


const CustomTabNav = createMaterialTopTabNavigator(
    {
        Medicines: MedicationScreen,
        History: ShareHistory,
    },
    {
        navigationOptions: {
            tabBarVisible: false,
        },
        headerMode: 'none',
        tabBarPosition: 'top',
        swipeEnabled: true,
        animationEnabled: true,
        lazy: true,
        tabBarOptions: {
            activeTintColor: Colors.blueTextColor,
            inactiveTintColor: Colors.black3,
            style: {
                backgroundColor: Colors.white,
            },
            labelStyle: {
                textAlign: 'center',
            },
            indicatorStyle: {
                borderBottomColor: Colors.blueTextColor,
                borderBottomWidth: 3,
            },
        },
        defaultNavigationOptions: ({ navigation }) => ({
            tabBarLabel: ({ focused, tintColor }) => {
                const { routeName } = navigation.state;
                let label;
                switch (routeName) {
                    case 'Medicines':
                        return (
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                {/*<CalenderIcon*/}
                                {/*  width={heightPercentageToDP(2)}*/}
                                {/*  height={heightPercentageToDP(2)}*/}
                                {/*  fill={tintColor}*/}
                                {/*/>*/}
                                <Text
                                    style={{
                                        fontSize: hp(2),
                                        fontFamily: Fonts.NunitoBold,
                                        color: tintColor,
                                        marginLeft: hp(1.5),
                                    }}>
                                    Medicines
                                </Text>
                            </View>
                        );
                    case 'History':
                        return (
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                {/*<RxIcon*/}
                                {/*  width={heightPercentageToDP(2)}*/}
                                {/*  height={heightPercentageToDP(2)}*/}
                                {/*  fill={tintColor}*/}
                                {/*/>*/}
                                <Text
                                    style={{
                                        fontSize: hp(2),
                                        fontFamily: Fonts.NunitoBold,
                                        color: tintColor,
                                        marginLeft: hp(1.5),
                                    }}>
                                    History
                                </Text>
                            </View>
                        );
                }
                return label;
            },
        }),
    },
);
const Medicines = createStackNavigator(
    {
        Medicines: MedicationScreen,
    },
    {
        headerMode: 'none',
    },
);
const History = createStackNavigator(
    {
        History: ShareHistory,
    },
    {
        headerMode: 'none',
    },
);
const CustomTabNavigation = {
    CustomTabNav,
};

export default CustomTabNavigation;
