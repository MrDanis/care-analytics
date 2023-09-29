/* istanbul ignore file */
import React, {Component, Fragment} from 'react';
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
  Switch,
  Animated,
} from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';

import {
  heightPercentageToDP,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Fonts} from '../../../../../config/AppConfig';
import {Colors} from '../../../../../config';
import Collapsible from 'react-native-collapsible';

class IntercationDetailItem extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeSections: [],
      collapsed: true,
      multipleSelect: false,
    };
  }

  componentDidMount(): void {}

  toggleExpanded = () => {
    this.setState({collapsed: !this.state.collapsed});
    this.props.action()
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: Colors.lightGrey,
          marginLeft: hp(2),
          marginRight: hp(2),
          marginTop: hp(1),
          marginBottom: hp(1),
        }}
      />
    );
  };

  render() {
    const {multipleSelect, activeSections} = this.state;
    if (
      this.props.typeOfInteraction === 0 ||
      this.props.typeOfInteraction === 3 ||
      this.props.typeOfInteraction === 1
    ) {
      return (
        <View style={styles.container}>
          <TouchableOpacity style={{borderRadius: 10}} onPress={this.toggleExpanded
            }>
            <View
              style={[
                styles.header,
                {
                  backgroundColor: Colors.bleLayer4,
                  borderRadius: 10
                },
              ]}>
              <Text style={styles.headerText}>
                {`${this.props.item.title.trim()}`}
              </Text>
              {this.state.collapsed ? (
                <Text
                  style={{
                    fontFamily: 'WisemanPTSymbols',
                    fontSize: hp(4),
                    color: Colors.black1,
                    marginRight: hp(1),
                  }}>
                  Y
                </Text>
              ) : (
                <Text
                  style={{
                    fontFamily: 'WisemanPTSymbols',
                    fontSize: hp(4),
                    color: Colors.black1,
                    marginRight: hp(1),
                    marginBottom: hp(1),
                  }}>
                  Z
                </Text>
              )}
            </View>
          </TouchableOpacity>
          <Collapsible collapsed={this.state.collapsed} align="center">
            {Object.entries(this.props.item.details).map(
              ([key, value], index) => {
                if (
                  this.props.item.details[key].value === '' ||
                  this.props.item.details[key].value === null
                ) {
                  return null;
                } else {
                  return (
                    <View style={styles.content}>
                      <Text
                        style={{
                          fontFamily: Fonts.NunitoBold,
                          fontSize: hp(2),
                          color: Colors.black,
                          textAlign: 'left',
                        }}>
                        {this.props.item.details[key].key}
                      </Text>
                      <Text style={{color: Colors.assessment_blue_500, marginTop:hp(1)}}>{this.props.item.details[key].value.trim()}</Text>
                      {this.props.item.details[key].key.toLowerCase() !==
                        this.props.item.details[
                          this.props.item.details.length - 1
                        ].key.toLowerCase() && (
                        <View
                          style={{
                            height: 1,
                            width: '100%',
                            backgroundColor: Colors.lightGrey,
                            marginRight: hp(2),
                            marginTop: hp(2),
                          }}
                        />
                      )}
                    </View>
                  );
                }
              },
            )}
          </Collapsible>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <Collapsible collapsed={false} align="center">
            {Object.entries(this.props.item.details).map(([key, value]) => {
              if (key.toLowerCase() !== 'title' && value !== '') {
                return (
                  <View style={styles.content}>
                    <Text
                      style={{
                        fontFamily: Fonts.SourceSansBold,
                        fontSize: hp(2),
                        color: Colors.black1,
                        textAlign: 'left',
                      }}>
                      {this.props.item.details[key].key}
                    </Text>
                    <Text style={{color: Colors.assessment_blue_500, marginTop:hp(1)}}>{this.props.item.details[key].value.trim()}</Text>
                    {this.props.item.details[key].key.toLowerCase() !==
                      this.props.item.details[
                        this.props.item.details.length - 1
                      ].key.toLowerCase() && (
                      <View
                        style={{
                          height: 1,
                          width: '100%',
                          backgroundColor: Colors.lightGrey,
                          marginRight: hp(2),
                          marginTop: hp(2),
                        }}
                      />
                    )}
                  </View>
                );
              }
            })}
          </Collapsible>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bleLayer4,
    borderRadius:10
  },
  title: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '300',
    marginBottom: 20,
  },
  header: {
    paddingVertical: hp(1),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  headerText: {
    textAlign: 'left',
    fontSize: hp(2),
    fontFamily: Fonts.NunitoBold,
    width: '85%',
    paddingVertical: hp(1),
  },
  content: {
    padding: hp(1.5),
    flexDirection: 'column',
    alignItems: 'flex-start',
    backgroundColor: Colors.bleLayer4,
  },
  active: {
    backgroundColor: 'rgba(255,255,255,1)',
  },
  inactive: {
    backgroundColor: 'rgba(245,252,255,1)',
  },
  selectors: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  selector: {
    backgroundColor: '#F5FCFF',
    padding: 10,
  },
  activeSelector: {
    fontWeight: 'bold',
  },
  selectTitle: {
    fontSize: 14,
    fontWeight: '500',
    padding: 10,
  },
  multipleToggle: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 30,
    alignItems: 'center',
  },
  multipleToggle__title: {
    fontSize: 16,
    marginRight: 8,
  },
});
export default IntercationDetailItem;
