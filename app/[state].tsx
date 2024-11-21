import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function ModalScreen() {
  const { Win } = useLocalSearchParams<{ Win: string }>();
  console.log(Win);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modal {Win}</Text>
      <View style={styles.separator} />
      

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    filter: [{saturate: 0.5}, {grayscale: 0.25}]
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
