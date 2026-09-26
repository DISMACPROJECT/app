import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useUser } from '@store/hooks';
import { colors } from '@theme/colors';
import { spacing } from '@theme/spacing';
import { typography } from '@theme/typography';

const HomeScreen = () => {
  const user = useUser();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hola, {user?.name}</Text>
        <Text style={styles.subtitle}>Bienvenido a DCONTROL</Text>
      </View>

      <View style={styles.cardGrid}>
        <DashboardCard
          title="Marcajes"
          description="Ver y registrar marcajes"
          icon="⏱️"
        />
        <DashboardCard
          title="Tareas"
          description="Gestionar tus tareas"
          icon="✅"
        />
        <DashboardCard
          title="Reportes"
          description="Consultar reportes"
          icon="📊"
        />
        <DashboardCard
          title="Perfil"
          description="Configurar perfil"
          icon="👤"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actividad Reciente</Text>
        <View style={styles.activityItem}>
          <Text style={styles.activityText}>
            Tu app está lista para usar. Selecciona una sección del menú inferior.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

interface DashboardCardProps {
  title: string;
  description: string;
  icon: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  description,
  icon,
}) => (
  <TouchableOpacity activeOpacity={0.7} style={styles.card}>
    <Text style={styles.cardIcon}>{icon}</Text>
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardDescription}>{description}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  greeting: {
    ...typography.h2,
    color: colors.white,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body2,
    color: colors.white,
    opacity: 0.9,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: spacing.lg,
    gap: spacing.lg,
  },
  card: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardIcon: {
    fontSize: 32,
    marginBottom: spacing.md,
  },
  cardTitle: {
    ...typography.h6,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  cardDescription: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h5,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  activityItem: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: 8,
  },
  activityText: {
    ...typography.body2,
    color: colors.textSecondary,
  },
});

export default HomeScreen;
