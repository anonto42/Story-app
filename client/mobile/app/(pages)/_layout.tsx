import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function PagesLayout() {
  return (
    <Tabs
        screenOptions={{
            tabBarStyle: {
                display: 'none'
            }
        }}
    >
      <Tabs.Screen
        name="onboading"
        options={{
          title: "Onboading",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="auth"
        options={{
          title: "Auth",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
