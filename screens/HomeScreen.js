import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from "react-native";
import { getJSON } from "../utils/api";
import { API_BASE } from "../config/api";

export default function HomeScreen({ navigation }) {
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    loadFoods();
  }, []);

  const loadFoods = async () => {
    const res = await getJSON("foods.php");
    if (Array.isArray(res)) setFoods(res);
    else if (res.success === false) alert(res.message);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mau makan apa?</Text>
      <FlatList
        data={foods}
        keyExtractor={(i) => String(i.id)}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("FoodDetail", { id: item.id })}
          >
             {/* Jika ada gambar, tampilkan. Ganti logic URL sesuai path server */}
             {item.image && (
                <Image source={{uri: `${API_BASE}/images/${item.image}`}} style={styles.thumb} />
             )}
             <View style={styles.info}>
                <Text style={styles.foodName}>{item.name}</Text>
                <Text style={styles.resto}>{item.restaurant}</Text>
                <Text style={styles.price}>Rp {Number(item.price).toLocaleString()}</Text>
             </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor:'#f5f5f5' },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 15 },
  card: { backgroundColor: "#fff", borderRadius: 8, marginBottom: 12, elevation: 2, flexDirection:'row', overflow:'hidden' },
  thumb: { width: 100, height: 100, backgroundColor:'#eee' },
  info: { padding: 10, flex:1, justifyContent:'center' },
  foodName: { fontSize:16, fontWeight:'bold' },
  resto: { color:'#777', fontSize:12, marginVertical:4 },
  price: { color:'#00AA13', fontWeight:'bold' }
});