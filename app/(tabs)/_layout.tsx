import { Platform } from 'react-native';
import { Tabs } from "@/components/bottom-tabs";
import { List } from '@/lib/icons/List';
import { Settings } from '@/lib/icons/Settings';

export const unstable_settings = {
  initialRouteName: "index",
};

const getTabIcon = (iconName: string) => {
  if (Platform.OS === 'ios') {
    return () => ({ sfSymbol: iconName });
  } else if (Platform.OS === 'android') {
    return () => ({ materialIcon: iconName });
  } else {
    // Web and other platforms
    return ({ color }: { color: string }) =>
      iconName === 'home' ? <List className="text-foreground" /> : <Settings className="text-foreground" />;
  }
};

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Habits',
          // tabBarIcon: getTabIcon(Platform.select({
          //   ios: 'house',
          //   android: 'home',
          //   default: 'home'
          // })),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          // tabBarIcon: getTabIcon(Platform.select({
          //   ios: 'person',
          //   android: 'person',
          //   default: 'settings'
          // })),
        }}
      />
    </Tabs>
  );
}
