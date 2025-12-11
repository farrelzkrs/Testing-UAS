import React, { useState, useCallback } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getJSON } from "../utils/api";
import { useFocusEffect } from "@react-navigation/native";

export default function OrdersScreen() {
  const [orders, setOrders] = useState([]);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const token = await AsyncStorage.getItem("userToken");
        if (!token) return;
        const res = await getJSON("orders.php", token);
        if (res.success) setOrders(res.data || []);
      })();
    }, [])
  );

  return (
    <View style={{ flex: 1, padding: 15 }}>
      <Text style={{fontSize:20, fontWeight:'bold', marginBottom:15}}>Riwayat Pesanan</Text>
      <FlatList
        data={orders}
        keyExtractor={(o) => String(o.id)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                <Text style={{fontWeight:'bold'}}>Order #{item.id}</Text>
                <Text style={{color:'#888'}}>{item.status}</Text>
            </View>
            <View style={{marginVertical:10}}>
                {item.items && item.items.map((it, idx) => (
                    <Text key={idx}>- {it.food_name} x {it.qty}</Text>
                ))}
            </View>
            <Text style={{textAlign:'right', fontWeight:'bold', color:'#00AA13'}}>
                Total: Rp {Number(item.total).toLocaleString()}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
    card: { backgroundColor:'#fff', padding:15, borderRadius:8, marginBottom:10 }
});