import React from 'react';
import { SafeAreaView, Text, StyleSheet } from 'react-native';

const Exits = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Pantalla de Salidas</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default Exits;