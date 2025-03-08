import { Tabs } from "@/components/bottom-tabs";
import { Platform, useColorScheme } from 'react-native';
import Icon from '@react-native-vector-icons/material-design-icons';
export const unstable_settings = {
  initialRouteName: "index",
};

const homeIcon = Icon.getImageSourceSync('home', 24);
const ticketsIcon = Icon.getImageSourceSync('ticket-confirmation', 24);


export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colorScheme === 'dark' ? '#ff6b6b' : '#e53e3e',
      }}
      tabBarStyle={{
        backgroundColor: colorScheme === 'dark' ? '#1A202C' : '#FFFFFF',
      }}
      activeIndicatorColor={colorScheme === 'dark' ? '#ff6b6b80' : '#e53e3e80'}
      hapticFeedbackEnabled={true}
      scrollEdgeAppearance="opaque"
      translucent={true}
      labeled={true}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Habits',
          tabBarIcon: ({ focused }) =>
            Platform.select({
              ios: { sfSymbol: focused ? 'house.fill' : 'house' },
              android: homeIcon as any
            })
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused }) =>
            Platform.select({
              ios: { sfSymbol: focused ? 'wallet.pass.fill' : 'wallet.pass' },
              android: ticketsIcon as any
            })
        }}
      />
    </Tabs>
  );
}
