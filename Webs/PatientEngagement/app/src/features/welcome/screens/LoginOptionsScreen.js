/* istanbul ignore file */
import React, { Fragment, useEffect} from 'react';
import {Text, View, Image, StatusBar, SafeAreaView,TouchableOpacity} from 'react-native';


import Colors from '../../../../config/Colors';
import {
    heightPercentageToDP as hp,
    heightPercentageToDP,
} from 'react-native-responsive-screen';
import {Fonts} from '../../../../config/AppConfig';
import Images from '../../../../config/Images';
import ProfileIcon from '../../../../../assets/svg/new_profile_icon.svg';
import ForwardIcon from '../../../../../assets/svg/icon_forward.svg';
import WisemanIcon from '../../../../../assets/svg/Wiseman_logo_full_horizontal_colored.svg';

const LoginOptionScreen = ({navigation}) => {

    return (
        <Fragment>
            <SafeAreaView style={{flex:1}}>
            <View style={{flex: 1, backgroundColor: Colors.white}}>
                <Image
                    source={Images.appIcon}
                    style={{
                        marginTop: hp(10),
                        height: hp(20),
                        width: hp(20),
                        resizeMode: 'contain',
                        alignSelf: 'center',
                    }}
                />
                <Text style={{textAlign: 'center',
                    fontFamily: Fonts.SourceSansSemibold,
                    marginTop: hp(2),
                    fontSize: heightPercentageToDP(3.5),color:Colors.black4}}>
                    360HealthSpot
                </Text>
                <View style={{
                    minWidth:'100%',
                    minHeight:hp(8),
                    alignItems:'center',
                    flex:1,
                }}>
                    <TouchableOpacity style={{
                        flexDirection:'row',
                        borderRadius:8,
                        minWidth:'90%',
                        elevation:10,
                        minHeight:hp(8),
                        justifyContent:'center',
                        alignItems:'center',
                        backgroundColor:Colors.white,
                        shadowOffset: { width: 0.5, height: 0.5 },
                        shadowOpacity: 0.2,
                        shadowRadius: 8,
                        marginTop:hp(7),
                    }} onPress={() => navigation.navigate('AuthLoading')} >
                        <View style={{minWidth:'75%',
                            flexDirection:'row',
                            minHeight:hp(8),
                            alignItems:'center'
                        }}>
                            <ProfileIcon />
                            <Text style={{
                                textAlign: 'center',
                                fontFamily: Fonts.SourceSansRegular,
                                fontSize: heightPercentageToDP(3),
                                color:Colors.black4,
                                marginLeft:hp(3)
                            }}>
                                User with ACO
                            </Text>
                        </View>
                        <View style={{justifySelf:'flex-end'}}>
                            <ForwardIcon />
                        </View>
                    </TouchableOpacity>
                    <View style={{
                        flexDirection:'row',
                        borderRadius:8,
                        minWidth:'90%',
                        elevation:10,
                        minHeight:hp(8),
                        justifyContent:'center',
                        alignItems:'center',
                        backgroundColor:Colors.white,
                        shadowOffset: { width: 0.5, height: 0.5 },
                        shadowOpacity: 0.2,
                        shadowRadius: 8,
                        marginTop:hp(5)
                    }} >
                        <View style={{minWidth:'75%', flexDirection:'row', minHeight:hp(8), alignItems:'center'}}>
                            <ProfileIcon />
                            <Text style={{textAlign: 'center',
                                fontFamily: Fonts.SourceSansRegular,
                                fontSize: heightPercentageToDP(3),color:Colors.black4, marginLeft:hp(3)}}>
                                User without ACO
                            </Text>
                        </View>
                        <View style={{justifySelf:'flex-end'}}>
                            <ForwardIcon />
                        </View>
                    </View>
                    <View style={{justifyContent:'flex-end', flex:1,marginBottom:hp(5)}}>
                        <Text style={{textAlign: 'center',
                            fontFamily: Fonts.SourceSansRegular,
                            fontSize: heightPercentageToDP(2),color:Colors.black4, marginBottom:hp(2)}}>
                            From
                        </Text>
                        <WisemanIcon />
                    </View>
                </View>
            </View>
            </SafeAreaView>
        </Fragment>
    );
};

export default LoginOptionScreen;
