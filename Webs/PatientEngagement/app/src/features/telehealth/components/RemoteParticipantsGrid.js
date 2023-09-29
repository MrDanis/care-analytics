/* istanbul ignore file */
import * as React from 'react';
import {Text, View, StyleSheet} from 'react-native';

import {TwilioVideoParticipantView} from 'react-native-twilio-video-webrtc';
import {getInitials} from '../../../helpers/Common';
import {CircleText} from './CircleText';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Colors from '../../../../config/Colors';
import {Fonts} from '../../../../config/AppConfig';
interface VideoSection {
  items: [VideoItem];
}

interface VideoItem {
  participant: Object;
  track: Object;
  audioEnabled: boolean;
}

interface AudioItem {
  participant: Object;
  audioEnabled: boolean;
}

function getParticipantNameFromIdentifier(identifier): string {
  let items = identifier.split('_');
  let name = items[3];
  if (name === undefined || name === null) {
    name = 'Unknown Participant';
  }
  return name;
}

export class RemoteParticipantsGrid extends React.PureComponent {
  constructor(props) {
    super(props);
  }
  componentDidMount() {}

  render() {
    const videoItems: [VideoItem] = [];
    const audioItems: [AudioItem] = [];
    let participantsMap = this.props.roomParticipants;
    console.log('Participants: ', participantsMap);
    for (const [participantSid, valueObj] of participantsMap.entries()) {
      let participant = valueObj.participant;
      let videoTrack = valueObj.videoTrack;
      let audioTrack = valueObj.audioTrack;

      if (videoTrack === null || videoTrack === undefined) {
        continue;
      }
      if (valueObj.videoTrack.enabled || true) {
        videoItems.push({
          participant: participant,
          track: videoTrack,
          audioEnabled: audioTrack,
        });
      } else {
        audioItems.push({
          participant: participant,
          audioEnabled: audioTrack.enabled,
        });
      }
    }
    let itemsCount = videoItems.length;

    let videoSections: [VideoSection] = [];

    if (videoItems.length === 1) {
      videoSections.push({items: [videoItems[0]]});
    } else if (videoItems.length === 2) {
      videoSections.push({items: [videoItems[0]]});
      videoSections.push({items: [videoItems[1]]});
    } else if (videoItems.length === 3) {
      videoSections.push({items: [videoItems[0]]});
      videoSections.push({items: [videoItems[1], videoItems[2]]});
    } else if (videoItems.length === 4) {
      videoSections.push({items: [videoItems[0], videoItems[1]]});
      videoSections.push({items: [videoItems[2], videoItems[3]]});
    } else if (videoItems.length === 5) {
      videoSections.push({items: [videoItems[0]]});
      videoSections.push({items: [videoItems[1], videoItems[2]]});
      videoSections.push({items: [videoItems[3], videoItems[4]]});
    }
    /*
    return (
      <View style={styles.container}>
        <View style={styles.noVideoTextContainer}>
          <Text style={styles.noVideoText}>
            {getInitials(getParticipantNameFromIdentifier(''))}
          </Text>

          <View style={styles.noVideoDescriptionTextContainer}>
            <Text style={styles.participantName}>
              {getParticipantNameFromIdentifier('')}
            </Text>
            {true && (
              <Text
                style={styles.mutedParticipant}>
                {'y'}
              </Text>
            )}
          </View>
        </View>
      </View>
    );
    */

    return (
      <View style={styles.container}>
        {videoSections.map((value, index) => {
          return (
            <View style={styles.gridRow} key={index}>
              {value.items.map(videoItem => {
                return (
                  <View style={styles.gridRow} key={videoItem.participant.sid}>
                    {videoItem.track.enabled === true ? (
                      <TwilioVideoParticipantView
                        style={styles.remoteVideo}
                        scaleType="scale"
                        enabled={true}
                        key={videoItem.track.trackSid}
                        trackIdentifier={{
                          participantSid: videoItem.participant.sid,
                          videoTrackSid: videoItem.track.trackSid,
                        }}
                      />
                    ) : (
                      <View style={styles.noVideoTextContainer}>
                        <View style={styles.circleTextContainer}>
                          <CircleText
                            textLabel={getInitials(
                              getParticipantNameFromIdentifier(
                                videoItem.participant.identity,
                              ),
                            )}
                          />
                        </View>
                      </View>
                    )}
                    <View style={styles.noVideoDescriptionTextContainer}>
                      <Text style={styles.participantName}>
                        {getParticipantNameFromIdentifier(
                          videoItem.participant.identity,
                        )}
                      </Text>
                      {videoItem.audioEnabled === false && (
                        <Text style={styles.mutedParticipant}>{'y'}</Text>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          );
        })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'rgba(77,107,184,1)',
  },
  gridRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
    marginBottom: 0,
  },
  gridItem: {
    flex: 1,
    marginHorizontal: 0,
  },
  remoteVideo: {
    flex: 1,
    transform: [{scaleX: -1}],
  },
  noVideoTextContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(77,107,184,1)',
  },
  circleTextContainer: {
    width: '50%',
    aspectRatio: 1,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  noVideoDescriptionTextContainer: {
    // flex: 1,
    position: 'absolute',
    flexDirection: 'row',
    width: '100%',
    height: 30,
    // top: 3,
    bottom: 5,
    left: 10,
    right: 0,
  },
  mutedParticipant: {
    fontFamily: 'WisemanPTSymbols',
    fontSize: hp(3),
    color: Colors.white,
    textAlign: 'center',
  },
  participantName: {
    paddingHorizontal: 5,
    fontFamily: Fonts.SourceSansRegular,
    fontSize: hp(2),
    color: Colors.white,
  },
});
