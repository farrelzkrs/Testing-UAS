import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, Image, Alert, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE } from "../config/api";

export default function AddMenuScreen({ navigation }) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [restaurantId, setRestaurantId] = useState("1"); // Hardcoded contoh
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    const r = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!r.granted) return Alert.alert("Perlu ijin akses galeri");
    
    const p = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    
    if (!p.canceled) {
        setImage(p.assets[0].uri);
    }
  };

  const upload = async () => {
    const token = await AsyncStorage.getItem("userToken");
    if (!token) return Alert.alert("Login required");

    const form = new FormData();
    form.append("name", name);
    form.append("description", desc);
    form.append("price", price);
    form.append("restaurant_id", restaurantId);

    if (image) {
      const filename = image.split("/").pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : "image";
      // React Native FormData format untuk file
      form.append("image", { uri: image, name: filename, type });
    }

    try {
      const res = await fetch(`${API_BASE}/add_food.php`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        body: form,
      });
      const json = await res.json();
      
      if (json.success) {
        Alert.alert("Sukses", json.message);
        navigation.goBack();
      } else {
        Alert.alert("Gagal", json.message || "error");
      }
    } catch (e) {
      console.log(e);
      Alert.alert("Error", "Tidak bisa connect ke server");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput placeholder="Nama Makanan" style={styles.input} value={name} onChangeText={setName} />
      <TextInput placeholder="Deskripsi" style={styles.input} value={desc} onChangeText={setDesc} />
      <TextInput placeholder="Harga" keyboardType="numeric" style={styles.input} value={price} onChangeText={setPrice} />
      
      <TouchableOpacity onPress={pickImage} style={styles.imgBtn}>
        <Text>Pilih Gambar</Text>
      </TouchableOpacity>
      
      {image && <Image source={{ uri: image }} style={{ width: 100, height: 100, marginBottom:10 }} />}
      
      <TouchableOpacity onPress={upload} style={styles.uploadBtn}>
        <Text style={{color:'#fff', fontWeight:'bold'}}>Upload Menu</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    input: { borderWidth:1, borderColor:'#ddd', padding:10, borderRadius:8, marginBottom:10, backgroundColor:'#fff' },
    imgBtn: { padding:10, backgroundColor:'#eee', alignItems:'center', marginBottom:10, borderRadius:8 },
    uploadBtn: { backgroundColor:'#00AA13', padding:15, alignItems:'center', borderRadius:8 }
});