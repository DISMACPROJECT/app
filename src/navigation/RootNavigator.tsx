import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/stack';
import { useAppDispatch, useIsAuthenticated } from '@store/hooks';
import { setTokens } from '@store/slices/authSlice';
import { secureStorage, asyncStorage } from '@services/storage';
import { STORAGE_KEYS } from '@utils/constants';
import { colors } from '@theme/colors';
import SplashScreen from '@screens/auth/SplashScreen';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useIsAuthenticated();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restoreTokens = async () => {
      try {
        const accessToken = await secureStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        const refreshToken = await secureStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

        if (accessToken && refreshToken) {
          dispatch(
            setTokens({
              accessToken,
              refreshToken,
            })
          );
        }
      } catch (error) {
        console.error('Error restoring tokens:', error);
      } finally {
        setIsLoading(false);
      }
    };

    restoreTokens();
  }, [dispatch]);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: colors.background },
        }}
      >
        {!isAuthenticated ? (
          <Stack.Screen
            name="Auth"
            component={AuthNavigator}
            options={{
              animationEnabled: false,
            }}
          />
        ) : (
          <Stack.Screen
            name="Root"
            component={MainNavigator}
            options={{
              animationEnabled: false,
            }}
          />
        )}
        <Stack.Screen
          name="NotFound"
          component={SplashScreen}
          options={{
            title: 'Oops!',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
