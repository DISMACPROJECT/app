import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as Location from 'expo-location';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { markAttendance, getAttendanceHistory } from '@store/slices/attendanceSlice';
import { colors } from '@theme/colors';
import { spacing } from '@theme/spacing';
import { typography } from '@theme/typography';
import { formatTime } from '@utils/formatting';

const AttendanceScreen = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { todayRecords, loading } = useAppSelector((state) => state.attendance);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);

  useEffect(() => {
    if (user?.id) {
      dispatch(getAttendanceHistory({ userId: user.id, days: 1 }));
    }
  }, [user?.id, dispatch]);

  const getLocation = async () => {
    try {
      setLocationLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Se necesita acceso a la ubicación');
        return null;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation(loc);
      return loc;
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'No se pudo obtener la ubicación');
      return null;
    } finally {
      setLocationLoading(false);
    }
  };

  const handleMarkAttendance = async (type: 'IN' | 'OUT') => {
    if (!user?.id) {
      Alert.alert('Error', 'Usuario no autenticado');
      return;
    }

    const loc = await getLocation();
    if (!loc && type === 'IN') {
      Alert.alert('Error', 'Se requiere ubicación para marcar entrada');
      return;
    }

    const payload = {
      type,
      latitude: loc?.coords.latitude || 0,
      longitude: loc?.coords.longitude || 0,
      accuracy: loc?.coords.accuracy || 0,
    };

    try {
      await dispatch(markAttendance(payload)).unwrap();
      Alert.alert(
        'Éxito',
        `Marcaje de ${type === 'IN' ? 'entrada' : 'salida'} registrado`
      );
      if (user?.id) {
        dispatch(getAttendanceHistory({ userId: user.id, days: 1 }));
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo marcar la asistencia');
    }
  };

  const hasMarkedIN = todayRecords.some((r) => r.type === 'IN');
  const hasMarkedOUT = todayRecords.some((r) => r.type === 'OUT');

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Marcajes</Text>
        <Text style={styles.date}>
          {new Date().toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </Text>
      </View>

      <View style={styles.buttonsSection}>
        <TouchableOpacity
          style={[
            styles.button,
            styles.inButton,
            hasMarkedIN && styles.buttonDisabled,
          ]}
          onPress={() => handleMarkAttendance('IN')}
          disabled={hasMarkedIN || loading || locationLoading}
        >
          {loading || locationLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Text style={styles.buttonText}>📍 Marcar Entrada</Text>
              {hasMarkedIN && (
                <Text style={styles.buttonSubtext}>
                  {formatTime(todayRecords.find((r) => r.type === 'IN')?.timestamp)}
                </Text>
              )}
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            styles.outButton,
            (!hasMarkedIN || hasMarkedOUT) && styles.buttonDisabled,
          ]}
          onPress={() => handleMarkAttendance('OUT')}
          disabled={!hasMarkedIN || hasMarkedOUT || loading || locationLoading}
        >
          {loading || locationLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Text style={styles.buttonText}>📍 Marcar Salida</Text>
              {hasMarkedOUT && (
                <Text style={styles.buttonSubtext}>
                  {formatTime(todayRecords.find((r) => r.type === 'OUT')?.timestamp)}
                </Text>
              )}
            </>
          )}
        </TouchableOpacity>
      </View>

      {todayRecords.length > 0 && (
        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>Historial de Hoy</Text>
          {todayRecords.map((record) => (
            <View key={record.id} style={styles.historyItem}>
              <View style={styles.historyLeft}>
                <Text style={styles.historyType}>
                  {record.type === 'IN' ? '🟢 Entrada' : '🔴 Salida'}
                </Text>
                <Text style={styles.historyTime}>
                  {formatTime(record.timestamp)}
                </Text>
              </View>
              <View style={styles.historyRight}>
                <Text style={styles.historyAccuracy}>
                  ±{Math.round(record.location?.accuracy || 0)}m
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      <View style={styles.infoSection}>
        <Text style={styles.infoText}>
          ℹ️ Tus marcajes se guardan con coordenadas GPS para verificación
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
  date: {
    ...typography.body2,
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },
  buttonsSection: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  button: {
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    borderRadius: spacing.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  inButton: {
    backgroundColor: '#10b981',
  },
  outButton: {
    backgroundColor: '#ef4444',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    ...typography.button,
    color: 'white',
    fontSize: 18,
    marginBottom: spacing.xs,
  },
  buttonSubtext: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.8)',
    marginTop: spacing.xs,
  },
  historySection: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.md,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: spacing.borderRadius.md,
    marginBottom: spacing.sm,
  },
  historyLeft: {
    flex: 1,
  },
  historyRight: {
    alignItems: 'flex-end',
  },
  historyType: {
    ...typography.body1,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  historyTime: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  historyAccuracy: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  infoSection: {
    padding: spacing.lg,
    marginTop: spacing.md,
  },
  infoText: {
    ...typography.body2,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default AttendanceScreen;
