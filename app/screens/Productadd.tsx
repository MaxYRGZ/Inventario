import React, { useState } from "react";
import { SafeAreaView, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { RouteProp, useNavigation } from '@react-navigation/native';
import WebServiceParams from "./WebServiceParams";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import LocalDB from "../persistance/localdb";

type ProductAddScreenProps = StackNavigationProp<RootStackParamList,'ProductAdd'>;
type ProductAddRoute = RouteProp<RootStackParamList, 'ProductAdd'>;

type ProductAddProps = {
  navigation: ProductAddScreenProps;
  route: ProductAddRoute;
};

function ProductAdd({navigation}:ProductAddProps): React.JSX.Element {
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [minStock, setMinStock] = useState("");
  const [maxStock, setMaxStock] = useState("");
  const [currentStock, setCurrentStock] = useState("");

  const addProduct = async () => {
    try {
      const db = await LocalDB.connect();
      await db.transaction(async (tx) => {
        await tx.executeSql(
          "INSERT INTO productos (nombre, precio, miniStock, maxStock, currentStock) VALUES (?, ?, ?, ?, ?)",
          [nombre, parseFloat(precio), parseInt(minStock), parseInt(maxStock), parseInt(currentStock)] // Use currentStock
        );
      });
      navigation.goBack();
    } catch (error) {
      console.error("Error al agregar producto:", error);
    }
  };

  const btnGuardarOnPress = async () => {
    const db = await LocalDB.connect();
    db.transaction(tx => {
        tx.executeSql(
          'INSERT INTO productos (nombre, precio, minStock) VALUES (?, ?, ?)',
          [nombre, precio, minStock],
        );
        navigation.goBack();});
    const response = await fetch(
        `http://${WebServiceParams.host}:${WebServiceParams.port}/productos`,
        {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({nombre, precio, minStock}),
        });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.label}>Nombre:</Text>
      <TextInput
        style={styles.input}
        value={nombre}
        onChangeText={setNombre}
        placeholder="Nombre del producto"
      />
      <Text style={styles.label}>Precio:</Text>
      <TextInput
        style={styles.input}
        value={precio}
        onChangeText={setPrecio}
        placeholder="Precio"
        keyboardType="numeric"
      />
      <Text style={styles.label}>Stock mínimo:</Text>
      <TextInput
        style={styles.input}
        value={minStock}
        onChangeText={setMinStock}
        placeholder="Stock mínimo"
        keyboardType="numeric"
      />
      <Text style={styles.label}>Stock máximo:</Text>
      <TextInput
        style={styles.input}
        value={maxStock}
        onChangeText={setMaxStock}
        placeholder="Stock máximo"
        keyboardType="numeric"
      />
      <Text style={styles.label}>Stock actual:</Text>
      <TextInput
        style={styles.input}
        value={currentStock}
        onChangeText={setCurrentStock}
        placeholder="Stock actual"
        keyboardType="numeric"
      />
      <Button title="Agregar Producto" onPress={btnGuardarOnPress} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontWeight: "bold",
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});

export default ProductAdd;
