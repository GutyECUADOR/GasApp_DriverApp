import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './context/AuthContext';
import { Navigator } from './navigator/Navigator';
import { LocationProvider } from './context/LocationContext';

const AppState = ({ children }: any ) => {
  return (
    <AuthProvider>
      { children }
    </AuthProvider>
  )
}

const LocationState = ({ children }: any ) => {
  return (
    <LocationProvider>
      { children }
    </LocationProvider>
  )
}

const MyApp = () => {
  return (
    <NavigationContainer>
      <AppState>
        <LocationState>
          <Navigator />
        </LocationState>
      </AppState>
    </NavigationContainer>
    
  );
}

export default MyApp;