import { Platform } from 'react-native';
import { withLayoutContext } from 'expo-router';
import {
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {
  createNativeBottomTabNavigator,
  NativeBottomTabNavigationOptions,
  NativeBottomTabNavigationEventMap,
} from '@bottom-tabs/react-navigation';
import { ParamListBase, TabNavigationState } from '@react-navigation/native';

const NativeBottomTabNavigator = createNativeBottomTabNavigator().Navigator;
const ExpoBottomTabNavigator = createBottomTabNavigator().Navigator;

// Use platform-specific navigator
const BottomTabNavigator = Platform.select({
  ios: () => NativeBottomTabNavigator,
  android: () => NativeBottomTabNavigator,
  default: () => ExpoBottomTabNavigator,
})();

export const Tabs = withLayoutContext<
  NativeBottomTabNavigationOptions,
  typeof BottomTabNavigator,
  TabNavigationState<ParamListBase>,
  NativeBottomTabNavigationEventMap
>(BottomTabNavigator);
