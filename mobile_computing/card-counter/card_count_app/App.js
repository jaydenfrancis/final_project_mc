import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import {
  useCameraDevices,
  Camera,
  useFrameProcessor,
} from "react-native-vision-camera";
import { roboflowDetect } from "./detect";
import {
  runOnJS,
  useSharedValue,
} from "react-native-reanimated";

export default function App() {
  const devices = useCameraDevices("wide-angle-camera");
  const device = devices.back;

  const frameProcessor = useFrameProcessor((frame) => {
    "worklet";
    const [detections, width, height] = roboflowDetect(frame);
    console.log(`Detections in Frame: ${detections.length}`);
}, []);
  if (device == null) return <Text>Loading...</Text>;
  return (
    <View style={styles.container}>
      <Camera
    style={StyleSheet.absoluteFill}
    device={device}
    isActive={true}
    frameProcessor={frameProcessor}
/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
