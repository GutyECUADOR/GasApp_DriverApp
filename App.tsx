import 'react-native-gesture-handler';
import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import HomeScreen from './screens/home/homeScreen';
import CustomDrawer from './components/customDrawerScreen';
import { LogBox } from 'react-native'
import { screenWidth, Sizes } from './constants/styles';
import ChatWithPassengerScreen from './screens/chatWithPassenger/chatWithPassengerScreen';
import GoToPickupScreen from './screens/goToPickup/goToPickupScreen';
import StartRideScreen from './screens/startRide/startRideScreen';
import EndRideScreen from './screens/endRide/endRideScreen';
import EditProfileScreen from './screens/editProfile/editProfileScreen';
import UserRidesScreen from './screens/userRides/userRidesScreen';
import RideDetailScreen from './screens/rideDetail/rideDetailScreen';
import UserRatingsScreen from './screens/userRatings/userRatingsScreen';
import WalletScreen from './screens/wallet/walletScreen';
import NotificationsScreen from './screens/notifications/notificationsScreen';
import SplashScreen from './screens/splashScreen';
import LoginScreen from './screens/auth/loginScreen';
import RegisterScreen from './screens/auth/registerScreen';
import VerificationScreen from './screens/auth/verificationScreen';
import InviteFriendsScreen from './screens/inviteFriends/inviteFriendsScreen';
import FaqsScreen from './screens/faqs/faqsScreen';
import ContactUsScreen from './screens/contactUs/contactUsScreen';

LogBox.ignoreAllLogs();

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const DrawerNavigation = () => {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: { width: screenWidth - 90.0, borderTopRightRadius: Sizes.fixPadding * 2.0, borderBottomRightRadius: Sizes.fixPadding * 2.0, },
        drawerType: 'front',
      }}

    >
      <Drawer.Screen name="DrawerScreen" component={HomeScreen} />
    </Drawer.Navigator>
  )
}

function MyApp() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          ...TransitionPresets.SlideFromRightIOS,
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} options={{ ...TransitionPresets.DefaultTransition }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ ...TransitionPresets.DefaultTransition }} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Verification" component={VerificationScreen} />
        <Stack.Screen name="Home" component={DrawerNavigation} options={{ ...TransitionPresets.DefaultTransition }} />
        <Stack.Screen name="ChatWithPassenger" component={ChatWithPassengerScreen} />
        <Stack.Screen name="GoToPickup" component={GoToPickupScreen} />
        <Stack.Screen name="StartRide" component={StartRideScreen} />
        <Stack.Screen name="EndRide" component={EndRideScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="UserRides" component={UserRidesScreen} />
        <Stack.Screen name="RideDetail" component={RideDetailScreen} />
        <Stack.Screen name="UserRatings" component={UserRatingsScreen} />
        <Stack.Screen name="Wallet" component={WalletScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="InviteFriends" component={InviteFriendsScreen} />
        <Stack.Screen name="Faqs" component={FaqsScreen} />
        <Stack.Screen name="ContactUs" component={ContactUsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default MyApp;