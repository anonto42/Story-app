import { Tabs } from "expo-router";

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
        name="signin"
        options={{
          title: "Sign In",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="signup"
        options={{
          title: "Sign Up",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="forgotpassword"
        options={{
          title: "Forgot Password",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="verifyotp"
        options={{
          title: "Verify OTP",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="createnewpassword"
        options={{
          title: "Create New Password",
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
