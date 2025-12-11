import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      const u = await AsyncStorage.getItem("user");
      if (u) setUser(JSON.parse(u));
    })();
  }, []);

  const logout = async () => {
    await AsyncStorage.removeItem("userToken");
    await AsyncStorage.removeItem("user");
    navigation.replace("Login");
  };

  return (
    <View style={{ flex: 1, padding: 20, alignItems:'center', justifyContent:'center' }}>
      <Text style={{ fontSize: 24, fontWeight:'bold' }}>{user?.name || "User"}</Text>
      <Text style={{ color:'#666', marginBottom:30 }}>{user?.email}</Text>

      <TouchableOpacity onPress={logout} style={styles.btnLogout}>
        <Text style={{ color: "#fff", fontWeight:'bold' }}>Logout</Text>
      </TouchableOpacity>

      {user?.role === "admin" && (
        <TouchableOpacity
          onPress={() => navigation.navigate("AddMenu")}
          style={styles.btnAdmin}
        >
          <Text style={{ color: "#fff" }}>[Admin] Tambah Menu</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
    btnLogout: { backgroundColor:'#d00', paddingVertical:12, paddingHorizontal:40, borderRadius:8 },
    btnAdmin: { marginTop: 20, backgroundColor: "#0077ff", padding: 12, borderRadius: 8 }
});