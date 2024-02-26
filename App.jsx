import React, { useState } from "react";
import { View, Image, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import doggy from './assets/doggy.jpg'; // Adjust the path and extension accordingly


export default App = () => {
    const [perritoData, setPerritoData] = useState(null);
    const [error, setError] = useState(null);
    const [imageGallery, setImageGallery] = useState([]);

    const getPerrito = async () => {
        try {
            const res = await fetch('https://dog.ceo/api/breeds/image/random');
            const data = await res.json();
            if (data.error) {
                setError(data.error.message);
            } else {
                setPerritoData(data);
            }
        } catch (err) {
            setError('Error finding perrito data');
        }
    };

    const openImageLibrary = async () => {
        const options = {};
        try {
            const result = await ImagePicker.launchImageLibraryAsync(options);
            if (!result.didCancel) {
                const imageUri = result.assets[0].uri;
                setImageGallery([...imageGallery, imageUri]); // Agregar la imagen al repertorio
                await saveImageToLocal(imageUri);
                console.log('Imagen seleccionada:', imageUri);
            }
        } catch (error) {
            console.log('Error al abrir la biblioteca de imágenes:', error);
        }
    };

    const saveImageToLocal = async (imageUri) => {
        try {
            await AsyncStorage.setItem('imageGallery', JSON.stringify(imageGallery)); // Guardar el repertorio completo en AsyncStorage
            console.log('Imagen guardada localmente:', imageUri);
        } catch (error) {
            console.log('Error al guardar la imagen localmente:', error);
        }
    };

    const deleteImage = async (index) => {
        try {
            const updatedGallery = [...imageGallery];
            updatedGallery.splice(index, 1); // Eliminar la imagen del repertorio
            setImageGallery(updatedGallery);
            await AsyncStorage.setItem('imageGallery', JSON.stringify(updatedGallery)); // Actualizar el repertorio en AsyncStorage
            console.log('Imagen eliminada del repertorio:', index);
        } catch (error) {
            console.log('Error al eliminar la imagen del repertorio:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to perritos app</Text>

            {perritoData && (
                <View>
                    <Image style={styles.perritoImage}
                        source={{ uri: perritoData.message }}
                    />
                </View>
            )}

            <ScrollView horizontal={true}>
                {imageGallery.map((imageUri, index) => (
                    <View key={index}>
                        <Image source={{ uri: imageUri }} style={{ width: 200, height: 200, margin: 5, borderRadius: 5, }} />
                        <TouchableOpacity onPress={() => deleteImage(index)} style={styles.deleteButton}>
                            <Text style={styles.deleteButtonText}>Eliminar</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>

            <TouchableOpacity style={styles.button} onPress={getPerrito}>
                <Text style={styles.buttonText}>Get Random Perrito</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={openImageLibrary}>
                <Text style={styles.buttonText}>Subir Foto</Text>
            </TouchableOpacity>

            {error && <Text>{error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        height: "100%",
        width: "100%",
        flex: 1,
        justifyContent: "top",
        alignItems: "center",
        marginTop: 20,
        
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        color: "#FAFAFA",
    },
    buttonText: {
        fontSize: 20,
        color: "white",
    },
    button: {
        backgroundColor: "#658eab",
        padding: 10,
        marginTop: 20,
        borderRadius: 5,
    },
    perritoImage: {
        width: 300,
        height: 300,
        borderRadius: 150,
        margin: 10,
    },
    deleteButton: {
        backgroundColor: "#ee4242",
        padding: 5,
        marginTop: 5,
        alignItems: "center",
        borderRadius: 5,
        margin: 5,
    },
    deleteButtonText: {
        color: "white",
    },
});