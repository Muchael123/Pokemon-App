import { StyleSheet, Text, View } from 'react-native';

export default function TabTwoScreen() {
  const instructions = [
    "Welcome to Pokemon Memory Game",
    "You will be shown Pokemon images starting from 6 images",
    "You have to select all the images without repeating any",
    "If you select a Pokemon twice, you lose",
    "If you select all the Pokemons without repeating, you win",
    "Good Luck!",
  ]
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Instructions</Text>
      {instructions.map((instruction, index) => (
        <Text style={styles.inst} key={index}>{index}. {instruction}</Text>
      ))}
      <View style={styles.separator} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  inst: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
    color: 'green'
  }
});
