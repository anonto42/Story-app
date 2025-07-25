import { Tabs } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { StyleSheet } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: "#ffffff",
        tabBarInactiveTintColor: "gray",
        tabBarBackground: () => (
          <BlurView intensity={30} tint="prominent" style={StyleSheet.absoluteFill} />
        ),
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: "Lora-Bold",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="playlist"
        options={{
          title: "Playlist",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="playlist-music-outline" size={size + 3} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 60,
    height: 80,
    borderTopWidth: 1,
    paddingTop: 5,
    zIndex: 999,
  },
});
