import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors } from '@theme/colors';
import { spacing } from '@theme/spacing';
import { typography } from '@theme/typography';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>DCONTROL</Text>
      <Text style={styles.subtitle}>Control de Personal Operativo</Text>
      <ActivityIndicator
        size="large"
        color={colors.primary}
        style={{ marginTop: spacing.xl }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
  },
  title: {
    ...typography.h1,
    color: colors.primary,
    marginBottom: spacing.md,
  },
  subtitle: {
    ...typography.body2,
    color: colors.textSecondary,
  },
});

export default SplashScreen;
