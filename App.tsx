import React, {useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NotifierWrapper} from 'react-native-notifier';
import {GestureHandlerRootView, ScrollView} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import useBiometricLogic from './useBiometricLogic';
import NavigationService from './NavigationService';
// import {KeyboardProvider} from 'react-native-keyboard-controller';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Animated Text Component
const AnimatedText = ({text, index}: {text: string; index: number}) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  React.useEffect(() => {
    opacity.value = withDelay(index * 100, withTiming(1, {duration: 1000}));
    translateY.value = withDelay(index * 100, withTiming(0, {duration: 1000}));
  }, [index, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{translateY: translateY.value}],
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      <Text style={{fontSize: 24, marginBottom: 20, color: 'red'}}>{text}</Text>
    </Animated.View>
  );
};

// Screen 1: Home Screen
const HomeScreen = ({_isNavigationReady = false}: any) => {
  const {verifyBiometric} = useBiometricLogic();
  useEffect(() => {
    verifyBiometric(
      () => {
        console.log('onSuccess');
      },
      () => {
        console.log('onFailure');
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const requestUserNotificationPermission = async () => {
    try {
      // Request Android notification permission first
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            'android.permission.POST_NOTIFICATIONS',
            {
              title: 'Notification Permission',
              message:
                'App needs access to your notifications so you can get updates',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          }
        } catch (err) {
          console.log('Notification permission error:', err);
        }
      }

      // DeviceTokenHandler.requestMessagingPermissionAndUpdateToken(dispatch);
    } catch (error) {
      console.log('General permission error:', error);
    }
  };

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message:
              'This app needs access to your location to provide better services.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.log('Location permission error:', err);
        return false;
      }
    }
    return true; // iOS handles location permission differently
  };
  const manualSetTimeouTesting = () => {
    setTimeout(() => {
      console.log('timeout 1 seconds');
    }, 1000);
    setTimeout(() => {
      console.log('timeout 2 seconds');
    }, 2000);
    setTimeout(() => {
      console.log('timeout 3 seconds');
    }, 3000);
  };

  return (
    <ScrollView>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <AnimatedText text="Home Screen" index={0} />
        <TouchableOpacity
          onPress={() => NavigationService.navigate('Profile')}
          style={{padding: 10, backgroundColor: '#007AFF', borderRadius: 5}}>
          <Text style={{color: 'white'}}>Go to Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            padding: 10,
            borderRadius: 5,
            marginTop: 20,
          }}
          onPress={() => manualSetTimeouTesting()}>
          <Text style={{color: '#000', textAlign: 'center'}}>
            Manual Set Timeout
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            padding: 10,
            borderRadius: 5,
            marginTop: 20,
          }}
          onPress={() => requestLocationPermission()}>
          <Text style={{color: '#000', textAlign: 'center'}}>
            Request Location Permission
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            padding: 10,
            borderRadius: 5,
            marginTop: 20,
          }}
          onPress={() => requestUserNotificationPermission()}>
          <Text style={{color: '#000', textAlign: 'center'}}>
            Request User Notification Permission
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// Screen 2: Profile Screen
const ProfileScreen = (props: any) => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{fontSize: 24, marginBottom: 20}}>Profile Screen</Text>
      <TouchableOpacity
        onPress={() => props.navigation.navigate('TabNavigator')}
        style={{padding: 10, backgroundColor: '#007AFF', borderRadius: 5}}>
        <Text style={{color: 'white'}}>Open Bottom Tabs</Text>
      </TouchableOpacity>
    </View>
  );
};

// Screen 3: Settings (Bottom Tab)
const SettingsScreen = () => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{fontSize: 24}}>Settings Screen</Text>
      <Text style={{marginTop: 10, color: '#666'}}>Bottom Tab 1</Text>
    </View>
  );
};

// Screen 4: Notifications (Bottom Tab)
const NotificationsScreen = () => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{fontSize: 24}}>Notifications Screen</Text>
      <Text style={{marginTop: 10, color: '#666'}}>Bottom Tab 2</Text>
    </View>
  );
};

// Bottom Tab Navigator
const TabNavigator = () => (
  <Tab.Navigator id={undefined}>
    <Tab.Screen
      name="Settings"
      component={SettingsScreen}
      options={{tabBarLabel: 'Settings'}}
    />
    <Tab.Screen
      name="Notifications"
      component={NotificationsScreen}
      options={{tabBarLabel: 'Notifications'}}
    />
  </Tab.Navigator>
);

// Main App Navigator
const AppNavigator = () => {
  const [isNavigationReady, setIsNavigationReady] = useState(false);
  return (
    <NavigationContainer
      ref={ref => {
        NavigationService.setTopLevelNavigator(ref);
      }}
      onReady={() => setIsNavigationReady(true)}>
      <Stack.Navigator initialRouteName="Home" id={undefined}>
        <Stack.Screen
          name="Home"
          // component={HomeScreen}
          options={{title: 'Home'}}>
          {(props: any) => (
            <HomeScreen {...props} isNavigationReady={isNavigationReady} />
          )}
        </Stack.Screen>
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{title: 'Profile'}}
        />
        <Stack.Screen
          name="TabNavigator"
          component={TabNavigator}
          options={{title: 'Bottom Tabs', headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <NotifierWrapper>
          {/* <KeyboardProvider> */}
          <AppNavigator />
          {/* </KeyboardProvider> */}
        </NotifierWrapper>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
