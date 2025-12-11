import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, TextInput, Alert } from "react-native";
import { getJSON } from "../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE } from "../config/api";

export default function FoodDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const [food, setFood] = useState(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    (async () => {
      const res = await getJSON(`food_detail.php?id=${id}`);
      if (res.success) setFood(res.data);
    })();
  }, []);

  if (!food) return <View style={{flex:1,justifyContent:'center'}}><Text style={{textAlign:'center'}}>Memuat...</Text></View>;

  const handleGoCheckout = async () => {
    const token = await AsyncStorage.getItem("userToken");
    if (!token) {
      Alert.alert("Perlu login", "Silakan login terlebih dahulu");
      navigation.navigate("Login");
      return;
    }
    navigation.navigate("Checkout", { food_id: food.id, qty: qty });
  };

  return (
    <View style={{ flex: 1, backgroundColor:'#fff' }}>
      {food.image && (
          <Image source={{uri: `${API_BASE}/images/${food.image}`}} style={{width:'100%', height:200}} />
      )}
      <View style={{padding:20}}>
        <Text style={{fontSize:22, fontWeight:'bold'}}>{food.name}</Text>
        <Text style={{fontSize:18, color:'#00AA13', marginVertical:8}}>Rp {Number(food.price).toLocaleString()}</Text>
        <Text style={{color:'#555'}}>{food.description}</Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.counter}>
            <TouchableOpacity onPress={() => setQty(Math.max(1, qty - 1))} style={styles.qtyBtn}><Text>-</Text></TouchableOpacity>
            <TextInput value={String(qty)} onChangeText={(t) => setQty(Number(t) || 1)} keyboardType="number-pad" style={styles.qtyInput} />
            <TouchableOpacity onPress={() => setQty(qty + 1)} style={styles.qtyBtn}><Text>+</Text></TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.btn} onPress={handleGoCheckout}>
            <Text style={{color:'#fff', fontWeight:'bold'}}>Beli Sekarang</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: { position:'absolute', bottom:0, width:'100%', padding:15, borderTopWidth:1, borderColor:'#eee', flexDirection:'row', justifyContent:'space-between', alignItems:'center', backgroundColor:'#fff' },
  counter: { flexDirection:'row', alignItems:'center' },
  qtyBtn: { padding: 10, backgroundColor: "#eee", borderRadius: 6, width:35, alignItems:'center' },
  qtyInput: { width: 50, textAlign: "center", marginHorizontal: 5, borderWidth: 1, borderColor: "#ddd", borderRadius: 6, padding: 5 },
  btn: { backgroundColor: "#00AA13", paddingVertical: 12, paddingHorizontal:20, borderRadius: 8 },
});