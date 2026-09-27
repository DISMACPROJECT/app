import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  FlatList,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { usePermissions } from '@hooks/usePermissions';
import { getTasks } from '@store/slices/taskSlice';
import { getAttendanceHistory } from '@store/slices/attendanceSlice';
import { notificationService } from '@services/notifications/notificationService';
import { colors } from '@theme/colors';
import { spacing } from '@theme/spacing';
import { typography } from '@theme/typography';
import { formatDate } from '@utils/formatting';

type ReportType = 'attendance' | 'tasks' | 'productivity';

interface ReportStats {
  totalEntries: number;
  totalExits: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  avgTaskCompletionTime: number;
}

const ReportsScreen = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { tasks } = useAppSelector((state) => state.tasks);
  const { records } = useAppSelector((state) => state.attendance);
  const permissions = usePermissions();

  const [reportType, setReportType] = useState<ReportType>('attendance');
  const [startDate, setStartDate] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<ReportStats | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        dispatch(getTasks()).unwrap(),
        dispatch(getAttendanceHistory({ userId: user?.id || '', days: 90 })).unwrap(),
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const startTime = startDate.getTime();
    const endTime = endDate.getTime();

    // Filter records by date range
    const filteredRecords = records.filter((r) => {
      const recordTime = new Date(r.timestamp).getTime();
      return recordTime >= startTime && recordTime <= endTime;
    });

    const filteredTasks = tasks.filter((t) => {
      const taskTime = new Date(t.createdAt).getTime();
      return taskTime >= startTime && taskTime <= endTime;
    });

    const newStats: ReportStats = {
      totalEntries: filteredRecords.filter((r) => r.type === 'IN').length,
      totalExits: filteredRecords.filter((r) => r.type === 'OUT').length,
      totalTasks: filteredTasks.length,
      completedTasks: filteredTasks.filter((t) => t.status === 'COMPLETED').length,
      pendingTasks: filteredTasks.filter((t) => t.status === 'PENDING').length,
      avgTaskCompletionTime: Math.round(
        filteredTasks.filter((t) => t.status === 'COMPLETED').length > 0
          ? filteredTasks
              .filter((t) => t.status === 'COMPLETED')
              .reduce((acc, t) => {
                const created = new Date(t.createdAt).getTime();
                const updated = new Date(t.updatedAt).getTime();
                return acc + (updated - created);
              }, 0) /
              filteredTasks.filter((t) => t.status === 'COMPLETED').length /
              (24 * 60 * 60 * 1000)
          : 0
      ),
    };

    setStats(newStats);
  };

  const handleGenerateReport = async () => {
    if (startDate > endDate) {
      Alert.alert('Error', 'La fecha inicial debe ser anterior a la fecha final');
      return;
    }
    calculateStats();
    await notificationService.notifyReportGenerated(reportType);
  };

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  const canAccessReports = permissions.can('view_all_data') || permissions.can('generate_reports');

  if (!canAccessReports) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Reportes</Text>
        <View style={styles.accessDenied}>
          <Text style={styles.accessDeniedText}>
            No tienes permiso para acceder a los reportes
          </Text>
        </View>
      </View>
    );
  }

  const renderStatCard = (label: string, value: number | string, icon: string) => (
    <View style={styles.statCard}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Reportes</Text>
        <Text style={styles.subtitle}>
          {formatDate(startDate)} - {formatDate(endDate)}
        </Text>
      </View>

      <View style={styles.filterSection}>
        <Text style={styles.sectionTitle}>Período de Reporte</Text>

        <View style={styles.datePickerRow}>
          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => setShowStartDatePicker(true)}
          >
            <Text style={styles.datePickerButtonText}>📅 Desde</Text>
            <Text style={styles.datePickerButtonValue}>{formatDate(startDate)}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => setShowEndDatePicker(true)}
          >
            <Text style={styles.datePickerButtonText}>📅 Hasta</Text>
            <Text style={styles.datePickerButtonValue}>{formatDate(endDate)}</Text>
          </TouchableOpacity>
        </View>

        {showStartDatePicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            onChange={handleStartDateChange}
          />
        )}

        {showEndDatePicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display="default"
            onChange={handleEndDateChange}
          />
        )}

        <View style={styles.reportTypeSection}>
          <Text style={styles.sectionTitle}>Tipo de Reporte</Text>
          <View style={styles.reportTypeButtons}>
            <TouchableOpacity
              style={[
                styles.reportTypeButton,
                reportType === 'attendance' && styles.reportTypeButtonActive,
              ]}
              onPress={() => setReportType('attendance')}
            >
              <Text
                style={[
                  styles.reportTypeButtonText,
                  reportType === 'attendance' && styles.reportTypeButtonTextActive,
                ]}
              >
                Asistencia
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.reportTypeButton,
                reportType === 'tasks' && styles.reportTypeButtonActive,
              ]}
              onPress={() => setReportType('tasks')}
            >
              <Text
                style={[
                  styles.reportTypeButtonText,
                  reportType === 'tasks' && styles.reportTypeButtonTextActive,
                ]}
              >
                Tareas
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.reportTypeButton,
                reportType === 'productivity' && styles.reportTypeButtonActive,
              ]}
              onPress={() => setReportType('productivity')}
            >
              <Text
                style={[
                  styles.reportTypeButtonText,
                  reportType === 'productivity' && styles.reportTypeButtonTextActive,
                ]}
              >
                Productividad
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={styles.generateButton}
          onPress={handleGenerateReport}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.generateButtonText}>📊 Generar Reporte</Text>
          )}
        </TouchableOpacity>
      </View>

      {stats && (
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Estadísticas</Text>

          {reportType === 'attendance' && (
            <>
              {renderStatCard('Entradas', stats.totalEntries, '🟢')}
              {renderStatCard('Salidas', stats.totalExits, '🔴')}
              {renderStatCard(
                'Asistencia',
                `${Math.round((stats.totalEntries / (stats.totalEntries + stats.totalExits || 1)) * 100)}%`,
                '📊'
              )}
            </>
          )}

          {reportType === 'tasks' && (
            <>
              {renderStatCard('Total Tareas', stats.totalTasks, '📋')}
              {renderStatCard('Completadas', stats.completedTasks, '✅')}
              {renderStatCard('Pendientes', stats.pendingTasks, '⏳')}
              {renderStatCard(
                'Tasa Complección',
                `${Math.round((stats.completedTasks / (stats.totalTasks || 1)) * 100)}%`,
                '📊'
              )}
            </>
          )}

          {reportType === 'productivity' && (
            <>
              {renderStatCard('Tareas Completadas', stats.completedTasks, '✅')}
              {renderStatCard('Días Promedio', stats.avgTaskCompletionTime || 0, '⏱️')}
              {renderStatCard('Entradas Registradas', stats.totalEntries, '🟢')}
              {renderStatCard(
                'Índice Productividad',
                `${Math.round((stats.completedTasks * 100) / (stats.totalTasks || 1))}%`,
                '🚀'
              )}
            </>
          )}
        </View>
      )}

      <View style={styles.infoSection}>
        <Text style={styles.infoText}>
          ℹ️ Los reportes se generan en base a los datos disponibles en el sistema durante el período seleccionado.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  filterSection: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.md,
  },
  datePickerRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  datePickerButton: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: spacing.borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  datePickerButtonText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  datePickerButtonValue: {
    ...typography.body2,
    color: colors.text,
    fontWeight: '600',
  },
  reportTypeSection: {
    marginBottom: spacing.lg,
  },
  reportTypeButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  reportTypeButton: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: spacing.borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
  },
  reportTypeButtonActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  reportTypeButtonText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  reportTypeButtonTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  generateButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    borderRadius: spacing.borderRadius.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  generateButtonText: {
    ...typography.button,
    color: 'white',
  },
  statsSection: {
    padding: spacing.lg,
  },
  statCard: {
    backgroundColor: colors.surface,
    borderRadius: spacing.borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  statValue: {
    ...typography.h3,
    color: colors.primary,
    fontWeight: '700',
  },
  infoSection: {
    padding: spacing.lg,
  },
  infoText: {
    ...typography.body2,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  accessDenied: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  accessDeniedText: {
    ...typography.body1,
    color: colors.error,
    textAlign: 'center',
  },
});

export default ReportsScreen;
