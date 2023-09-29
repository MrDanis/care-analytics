/* istanbul ignore file */
import React, {Component, Fragment} from 'react';
import {FlatList, Text, TouchableOpacity, View, Dimensions} from 'react-native';

import {
    heightPercentageToDP,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Fonts} from "../../../../../config/AppConfig";
import {Colors} from "../../../../../config";
import InteractionIcon from '../../../../../../assets/svg/interaction.svg';



class IntercationItem extends React.PureComponent {

    constructor(props) {
        super(props);
    }
    componentDidMount(): void {
        console.log('Interaction tem', this.props.item)
    }
    render() {
        return (  <View
            style={{
                alignItems: 'center',
                justifyContent: 'space-between',
                padding:hp(1),
            }}>
            <TouchableOpacity  style={{
                borderRadius: 4,
                flex: 1,
                alignItems:'center',
                justifyContent: 'center',
                flexDirection:'row',
                width:'100%',
            }} onPress={this.props.action}>
                <View style={{alignItems:'center', justifyContent:'flex-start',flexDirection:'row', flex:1, padding:hp(1), flexWrap:'wrap'}}>
                    <Text style={{fontFamily: Fonts.SourceSansBold,fontSize:hp(1.9),
                        color: Colors.darkGrey1, textAlign:'center', textTransform:'capitalize'}}  numberOfLines={0} ellipsizeMode='tail'>{this.props.item.interactionOneName.trim()}</Text>
                    <InteractionIcon style={{width:'10%', marginHorizontal:hp(1)}} />
                    <Text style={{fontFamily: Fonts.SourceSansBold,
                        color: Colors.darkGrey1,fontSize:hp(1.9),textAlign:'center', textTransform:'capitalize'}}  numberOfLines={0} ellipsizeMode='tail'>{this.props.item.interactionTwoName.trim()}</Text>
                </View>

                <View style={{width:'10%', alignSelf:'center', paddingVertical:hp(1), justifyContent:'flex-end', alignItems:'center'}}>
                    <Text
                        style={{
                            fontFamily: 'WisemanPTSymbols',
                            fontSize: hp(4),
                            color: Colors.black1,
                        }}>
                        X
                    </Text>
                </View>
            </TouchableOpacity>
        </View>

        );
    }
}

export default IntercationItem;
