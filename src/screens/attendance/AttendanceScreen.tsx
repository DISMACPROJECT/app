import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@theme/colors';
import { spacing } from '@theme/spacing';
import { typography } from '@theme/typography';

const AttendanceScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Marcajes</Text>
      <Text style={styles.subtitle}>Pantalla en construcción</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.md,
  },
  subtitle: {
    ...typography.body2,
    color: colors.textSecondary,
  },
});

export default AttendanceScreen;
