import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ActivityIndicator, View } from 'react-native';
import { store, persistor } from '@store/index';
import { initializeApiClient } from '@services/api';
import { secureStorage } from '@services/storage';
import { STORAGE_KEYS } from '@utils/constants';
import RootNavigator from '@navigation/RootNavigator';
import { colors } from '@theme/colors';

const getAccessToken = async () => {
  return await secureStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
};

// Initialize API client on app startup
initializeApiClient(getAccessToken);

const LoadingComponent = () => (
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

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <PersistGate loading={<LoadingComponent />} persistor={persistor}>
          <RootNavigator />
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;
