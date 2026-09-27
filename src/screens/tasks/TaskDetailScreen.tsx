import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  FlatList,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { driveService, PhotoUploadResult } from '@services/storage/driveService';
import { notificationService } from '@services/notifications/notificationService';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { colors } from '@theme/colors';
import { spacing } from '@theme/spacing';
import { typography } from '@theme/typography';
import { formatDate } from '@utils/formatting';

type TasksStackParamList = {
  TaskList: undefined;
  TaskDetail: { taskId: string };
};

type TaskDetailScreenProps = {
  route: RouteProp<TasksStackParamList, 'TaskDetail'>;
  navigation: NativeStackNavigationProp<TasksStackParamList, 'TaskDetail'>;
};

const TaskDetailScreen: React.FC<TaskDetailScreenProps> = ({ route }) => {
  const { taskId } = route.params;
  const { tasks } = useAppSelector((state) => state.tasks);
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState<PhotoUploadResult[]>([]);
  const [photosLoading, setPhotosLoading] = useState(false);

  const task = tasks.find((t) => t.id === taskId);

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      setPhotosLoading(true);
      const taskPhotos = await driveService.getTaskPhotos(taskId);
      setPhotos(taskPhotos);
    } catch (error) {
      console.error('Error loading photos:', error);
    } finally {
      setPhotosLoading(false);
    }
  };

  const handleTakePhoto = async () => {
    try {
      setLoading(true);
      const photoUri = await driveService.pickImageFromCamera();

      if (!photoUri) {
        Alert.alert('Cancelado', 'No se capturó ninguna foto');
        return;
      }

      const result = await driveService.uploadPhotoToTask(taskId, photoUri);

      if (result) {
        Alert.alert('Éxito', 'Foto cargada correctamente');
        await notificationService.notifyPhotoUploaded(result.fileName);
        loadPhotos();
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al cargar la foto');
    } finally {
      setLoading(false);
    }
  };

  const handleChoosePhoto = async () => {
    try {
      setLoading(true);
      const photoUri = await driveService.pickImageFromLibrary();

      if (!photoUri) {
        Alert.alert('Cancelado', 'No se seleccionó ninguna foto');
        return;
      }

      const result = await driveService.uploadPhotoToTask(taskId, photoUri);

      if (result) {
        Alert.alert('Éxito', 'Foto cargada correctamente');
        await notificationService.notifyPhotoUploaded(result.fileName);
        loadPhotos();
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al cargar la foto');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    Alert.alert(
      'Eliminar foto',
      '¿Estás seguro de que deseas eliminar esta foto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await driveService.deletePhoto(taskId, photoId);
              Alert.alert('Éxito', 'Foto eliminada');
              loadPhotos();
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar la foto');
            }
          },
        },
      ]
    );
  };

  if (!task) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Tarea no encontrada</Text>
      </View>
    );
  }

  const renderPhotoItem = ({ item }: { item: PhotoUploadResult }) => (
    <View style={styles.photoCard}>
      <Image
        source={{ uri: driveService.getThumbnailUrl(item.driveFileId) }}
        style={styles.photoThumbnail}
      />
      <View style={styles.photoInfo}>
        <Text style={styles.photoName} numberOfLines={1}>
          {item.fileName}
        </Text>
        <Text style={styles.photoDate}>
          {formatDate(item.uploadedAt)}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeletePhoto(item.id)}
      >
        <Text style={styles.deleteButtonText}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{task.title}</Text>
        <View style={styles.badges}>
          <View style={[styles.badge, { backgroundColor: '#f59e0b' }]}>
            <Text style={styles.badgeText}>{task.priority}</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: '#3b82f6' }]}>
            <Text style={styles.badgeText}>{task.status}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Descripción</Text>
        <Text style={styles.description}>{task.description}</Text>
      </View>

      {task.notes && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notas</Text>
          <Text style={styles.notes}>{task.notes}</Text>
        </View>
      )}

      {task.dueDate && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vencimiento</Text>
          <Text style={styles.dueDate}>{formatDate(task.dueDate)}</Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Fotos ({photos.length})</Text>

        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.button, styles.cameraButton]}
            onPress={handleTakePhoto}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>📸 Tomar Foto</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.libraryButton]}
            onPress={handleChoosePhoto}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>📷 Elegir de Galería</Text>
            )}
          </TouchableOpacity>
        </View>

        {photosLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : photos.length > 0 ? (
          <FlatList
            data={photos}
            renderItem={renderPhotoItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.photosList}
          />
        ) : (
          <View style={styles.emptyPhotos}>
            <Text style={styles.emptyPhotosText}>
              No hay fotos aún. Captura o sube una para esta tarea.
            </Text>
          </View>
        )}
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
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.md,
  },
  badges: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.borderRadius.sm,
  },
  badgeText: {
    ...typography.caption,
    color: 'white',
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.md,
  },
  description: {
    ...typography.body2,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  notes: {
    ...typography.body2,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  dueDate: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  button: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: spacing.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraButton: {
    backgroundColor: '#3b82f6',
  },
  libraryButton: {
    backgroundColor: '#8b5cf6',
  },
  buttonText: {
    ...typography.button,
    color: 'white',
    fontSize: 14,
  },
  photosList: {
    gap: spacing.md,
  },
  photoCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: spacing.borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  photoThumbnail: {
    width: 80,
    height: 80,
    borderRadius: spacing.borderRadius.sm,
    marginRight: spacing.md,
    backgroundColor: colors.border,
  },
  photoInfo: {
    flex: 1,
  },
  photoName: {
    ...typography.body2,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  photoDate: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  deleteButton: {
    padding: spacing.sm,
  },
  deleteButtonText: {
    fontSize: 18,
  },
  loaderContainer: {
    paddingVertical: spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyPhotos: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  emptyPhotosText: {
    ...typography.body2,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  errorText: {
    ...typography.h3,
    color: colors.error,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
});

export default TaskDetailScreen;
