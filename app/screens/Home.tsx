import React, { useState, useEffect } from "react";
import { SafeAreaView, Text, StyleSheet, View, Alert } from "react-native";
import { TouchableOpacity, FlatList } from "react-native-gesture-handler";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../App";
import { Product } from "./model/Product.ts/model/Product";
import WebServiceParams from "./WebServiceParams";
import LocalDB from "../persistance/localdb";

type HomeScreenProps = StackNavigationProp<RootStackParamList, 'Home'>;
type HomeScreenRoute = RouteProp<RootStackParamList, 'Home'>;

type HomeProps = {
    navigation: HomeScreenProps;
    route: HomeScreenRoute;
};

function Home({ navigation }: HomeProps): React.JSX.Element {
    const [products, setProducts] = useState<Product[]>([]);

    /*
    const fetchProducts = async () => {
        try {
            const response = await fetch(
                `http://${WebServiceParams.host}:${WebServiceParams.port}/productos`,
                {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                },
            );

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data: Product[] = await response.json();
            setProducts(data);
        } catch (error) {
            console.error("Error fetching data:", error);
            Alert.alert("Error", "Hubo un problema al obtener los datos");
        }
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchProducts();
        });

        return unsubscribe;
    }, [navigation]);
    */

    useEffect(() => {
      LocalDB.init();
      navigation.addListener('focus',async ()=>{
        try{
        const response = await fetch(
            `http://${WebServiceParams.host}:${WebServiceParams.port}/productos`,
            {
              method: 'GET',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'text/plain',
              },
            },
          );
          setProducts(await response.json());
         }catch(error){
          console.error(error);
         }
      })
    }, [navigation]);

    const productItem = ({ item }: { item: Product }) => (
        <TouchableOpacity style={styles.productItem} onPress={() => navigation.push("ProductDetails", { product: item })}>
            <View style={styles.productInfo}>
                <Text style={styles.itemTitle}>{item.nombre}</Text>
                <Text style={styles.itemDetails}>Precio: $ {item.precio.toFixed(2)}</Text>
            </View>
            <View style={styles.stockInfo}>
                <Text
                    style={[
                        styles.itemBadge,
                        item.currentStock < item.minStock ? styles.itemBadgeError : styles.itemBadgeOk,
                    ]}>
                    Stock: {item.currentStock}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <FlatList 
                data={products} 
                renderItem={productItem} 
                keyExtractor={(item) => item.id.toString()} 
                contentContainerStyle={styles.listContainer}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    listContainer: {
        padding: 10,
    },
    productItem: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    productInfo: {
        flex: 3,
    },
    stockInfo: {
        flex: 1,
        alignItems: 'flex-end',
    },
    itemTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    itemDetails: {
        fontSize: 14,
        color: '#888',
    },
    itemBadge: {
        fontSize: 14,
        fontWeight: 'bold',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 4,
    },
    itemBadgeOk: {
        backgroundColor: 'green',
        color: 'white',
    },
    itemBadgeError: {
        backgroundColor: 'red',
        color: 'white',
    },
});

export default Home;