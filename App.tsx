import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { Audio, Video } from 'expo-av';

interface Props {
}

interface State {
  rate: number,
  volume: number,
  muted: boolean,
  playbackInstance: Audio.Sound,
  shouldPlay: boolean,
  isPlaying: boolean,
  isBuffering: boolean,
}

export default class App extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      rate: 1.0,
      volume: 1.0,
      muted: false,
      playbackInstance: new Audio.Sound(),
      shouldPlay: false,
      isPlaying: false,
      isBuffering: false,
    };
  }

  componentDidMount = () => {
    console.log('componentDidMount')
    Audio.setAudioModeAsync({
      staysActiveInBackground: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: true,
      allowsRecordingIOS: true,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
    });
  }

  alarm = async () => {
    console.log('alarm')
    // const source = { uri: require('./assets/sounds/Clock-Alarm05-1.mp3') };
    const source = { uri: 'http://suaradio2.dyndns.ws:11004/stream' };
    const initialStatus = {
      shouldPlay: true,
      rate: this.state.rate,
      volume: this.state.volume,
      isMuted: this.state.muted,
    };

    const { sound, status } = await Audio.Sound.createAsync(
      source,
      initialStatus,
      this._onPlaybackStatusUpdate
    );
    this.setState({ playbackInstance: sound });
  }

  _onPlaybackStatusUpdate = (status: any) => {
    console.log('_onPlaybackStatusUpdate')
    if (status.isLoaded) {
      this.setState({
        shouldPlay: status.shouldPlay,
        isPlaying: status.isPlaying,
        isBuffering: status.isBuffering,
        rate: status.rate,
        muted: status.isMuted,
        volume: status.volume,
      });
    } else {
      if (status.error) {
        console.log(`FATAL PLAYER ERROR: ${status.error}`);
      }
    }
  }

  _onPlayPausePressed = () => {
    console.log('_onPlayPausePressed')
    if (this.state.isPlaying) {
      this.state.playbackInstance.pauseAsync();
    } else {
      this.state.playbackInstance.playAsync();
    }
  };

  

  render () {
    return(
      <View style={styles.container}>
        <Text>Open up App.tsx to start working on your app!</Text>
        <Button onPress={alarm} title='alarm'></Button>
        <Button onPress={this._onPlayPausePressed} title='stop'></Button>
      </View> 
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
