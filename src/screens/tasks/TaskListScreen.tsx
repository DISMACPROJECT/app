import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Alert,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { getTasks, updateTaskStatus } from '@store/slices/taskSlice';
import { usePermissions } from '@hooks/usePermissions';
import { colors } from '@theme/colors';
import { spacing } from '@theme/spacing';
import { typography } from '@theme/typography';
import { formatDate } from '@utils/formatting';

type FilterType = 'all' | 'assigned' | 'created';

const TaskListScreen = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { tasks, loading } = useAppSelector((state) => state.tasks);
  const permissions = usePermissions();
  const [filter, setFilter] = useState<FilterType>('assigned');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      await dispatch(getTasks()).unwrap();
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadTasks();
    setRefreshing(false);
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      await dispatch(
        updateTaskStatus({ taskId, status: 'COMPLETED' })
      ).unwrap();
      Alert.alert('Éxito', 'Tarea marcada como completada');
      loadTasks();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo actualizar la tarea');
    }
  };

  const getFilteredTasks = () => {
    let filtered = tasks;

    switch (filter) {
      case 'assigned':
        filtered = tasks.filter((t) => t.assignedTo === user?.id);
        break;
      case 'created':
        filtered = tasks.filter((t) => t.createdBy === user?.id);
        break;
      case 'all':
      default:
        filtered = tasks;
    }

    return filtered.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return '#ef4444';
      case 'MEDIUM':
        return '#f59e0b';
      case 'LOW':
        return '#10b981';
      default:
        return colors.textSecondary;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return '#6b7280';
      case 'IN_PROGRESS':
        return '#3b82f6';
      case 'COMPLETED':
        return '#10b981';
      default:
        return colors.textSecondary;
    }
  };

  const filteredTasks = getFilteredTasks();

  const renderTaskItem = ({ item }: any) => (
    <View style={styles.taskCard}>
      <View style={styles.taskHeader}>
        <View style={styles.taskTitleSection}>
          <Text style={styles.taskTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <View style={styles.taskMeta}>
            <View style={[styles.badge, { backgroundColor: getPriorityColor(item.priority) }]}>
              <Text style={styles.badgeText}>{item.priority}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: getStatusColor(item.status) }]}>
              <Text style={styles.badgeText}>{item.status}</Text>
            </View>
          </View>
        </View>
      </View>

      <Text style={styles.taskDescription} numberOfLines={2}>
        {item.description}
      </Text>

      {item.dueDate && (
        <Text style={styles.dueDate}>
          📅 Vence: {formatDate(item.dueDate)}
        </Text>
      )}

      {item.notes && (
        <Text style={styles.notes} numberOfLines={2}>
          📝 {item.notes}
        </Text>
      )}

      <View style={styles.taskFooter}>
        {item.assignedTo === user?.id && item.status !== 'COMPLETED' && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleCompleteTask(item.id)}
          >
            <Text style={styles.actionButtonText}>✓ Completar</Text>
          </TouchableOpacity>
        )}
        {permissions.can('view_all_data') && (
          <Text style={styles.taskId}>{item.id.substring(0, 8)}...</Text>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tareas</Text>
      </View>

      <View style={styles.filterSection}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'assigned' && styles.filterButtonActive,
          ]}
          onPress={() => setFilter('assigned')}
        >
          <Text
            style={[
              styles.filterButtonText,
              filter === 'assigned' && styles.filterButtonTextActive,
            ]}
          >
            Asignadas a mí
          </Text>
        </TouchableOpacity>

        {permissions.can('create_users') && (
          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === 'created' && styles.filterButtonActive,
            ]}
            onPress={() => setFilter('created')}
          >
            <Text
              style={[
                styles.filterButtonText,
                filter === 'created' && styles.filterButtonTextActive,
              ]}
            >
              Creadas por mí
            </Text>
          </TouchableOpacity>
        )}

        {permissions.isAdmin() && (
          <TouchableOpacity
            style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
            onPress={() => setFilter('all')}
          >
            <Text
              style={[
                styles.filterButtonText,
                filter === 'all' && styles.filterButtonTextActive,
              ]}
            >
              Todas
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {loading && !refreshing ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : filteredTasks.length > 0 ? (
        <FlatList
          data={filteredTasks}
          renderItem={renderTaskItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          contentContainerStyle={styles.tasksList}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay tareas disponibles</Text>
          <Text style={styles.emptySubtext}>
            {filter === 'assigned'
              ? 'No tienes tareas asignadas'
              : filter === 'created'
              ? 'No has creado tareas'
              : 'No hay tareas en el sistema'}
          </Text>
        </View>
      )}
    </View>
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
  },
  filterSection: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  filterButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  filterButtonActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  filterButtonText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  filterButtonTextActive: {
    color: 'white',
  },
  tasksList: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  taskCard: {
    backgroundColor: colors.surface,
    borderRadius: spacing.borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  taskHeader: {
    marginBottom: spacing.md,
  },
  taskTitleSection: {
    gap: spacing.sm,
  },
  taskTitle: {
    ...typography.h4,
    color: colors.text,
  },
  taskMeta: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.borderRadius.sm,
  },
  badgeText: {
    ...typography.caption,
    color: 'white',
    fontSize: 10,
  },
  taskDescription: {
    ...typography.body2,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  dueDate: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  notes: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    fontStyle: 'italic',
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTopWidth: 1,
    paddingTopColor: colors.border,
  },
  actionButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.borderRadius.sm,
  },
  actionButtonText: {
    ...typography.caption,
    color: 'white',
    fontWeight: '600',
  },
  taskId: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  emptyText: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptySubtext: {
    ...typography.body2,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default TaskListScreen;
