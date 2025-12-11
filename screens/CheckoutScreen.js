import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { postJSON, getJSON } from "../utils/api";

export default function CheckoutScreen({ route, navigation }) {
  const { food_id, qty: qtyParam } = route.params || {};
  const [food, setFood] = useState(null);
  const [qty, setQty] = useState(qtyParam || 1);

  useEffect(() => {
    (async () => {
      const res = await getJSON(`food_detail.php?id=${food_id}`);
      if (res.success) setFood(res.data);
    })();
  }, []);

  if (!food) return null;

  const total = Number(food.price) * Number(qty);

  const handleCheckout = async () => {
    const token = await AsyncStorage.getItem("userToken");
    if (!token) {
        Alert.alert("Error", "Sesi habis");
        navigation.replace('Login');
        return;
    }
    
    // Kirim data sebagai array items
    const items = [{ food_id: food.id, qty: Number(qty) }];
    const res = await postJSON("add_order.php", { items }, token);

    if (res.success) {
      Alert.alert("Sukses", "Pesanan dibuat", [
        { text: "OK", onPress: () => navigation.navigate('MainTabs', { screen: 'Orders' }) },
      ]);
    } else {
      Alert.alert("Gagal", res.message || "Error");
    }
  };

  return (
    <View style={{ padding: 20, flex:1, backgroundColor:'#fff' }}>
      <Text style={{fontSize:18, fontWeight:'bold'}}>{food.name}</Text>
      <Text>Harga Satuan: Rp {Number(food.price).toLocaleString()}</Text>
      
      <Text style={{marginTop:20, fontWeight:'bold'}}>Jumlah:</Text>
      <TextInput
        value={String(qty)}
        onChangeText={(t) => setQty(Number(t) || 1)}
        keyboardType="numeric"
        style={{ borderWidth: 1, borderColor: "#ddd", padding: 10, borderRadius: 6, marginVertical: 8 }}
      />
      
      <View style={{borderTopWidth:1, borderColor:'#eee', marginVertical:20}}/>
      
      <Text style={{fontSize:20, fontWeight:'bold', textAlign:'right'}}>Total: Rp {Number(total).toLocaleString()}</Text>
      
      <TouchableOpacity onPress={handleCheckout} style={styles.btn}>
        <Text style={styles.btnText}>Konfirmasi Pesanan</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    btn: { backgroundColor:'#00AA13', padding:15, borderRadius:8, marginTop:20, alignItems:'center' },
    btnText: { color:'#fff', fontWeight:'bold', fontSize:16 }
});