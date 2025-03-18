import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Text, Surface, ActivityIndicator, IconButton } from 'react-native-paper';
import { TaskContext } from '../context/TaskContext';

const TaskDetailsScreen = ({ route, navigation }) => {
  const { taskId } = route.params;
  const { getTask, updateTask, deleteTask, loading, error } = useContext(TaskContext);
  
  const [task, setTask] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchTaskDetails();
    
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <IconButton
            icon={isEditing ? "content-save" : "pencil"}
            onPress={isEditing ? handleSave : handleEdit}
            size={24}
            style={{ marginRight: 8 }}
          />
          <IconButton
            icon="delete"
            onPress={handleDelete}
            size={24}
            style={{ marginRight: 8 }}
          />
        </View>
      ),
    });
  }, [navigation, isEditing]);

  const fetchTaskDetails = async () => {
    try {
      const taskData = await getTask(taskId);
      setTask(taskData);
      setTitle(taskData.title);
      setDescription(taskData.description || '');
    } catch (err) {
      // Error is handled in TaskContext
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!title) {
      alert('Please enter a task title');
      return;
    }
    
    try {
      await updateTask(taskId, { title, description });
      setIsEditing(false);
      fetchTaskDetails();
    } catch (err) {
      // Error is handled in TaskContext
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTask(taskId);
              navigation.goBack();
            } catch (err) {
              // Error is handled in TaskContext
            }
          }
        },
      ]
    );
  };

  if (loading && !task) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!task) {
    return (
      <View style={styles.centered}>
        <Text>Task not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.surface}>
        {error && <Text style={styles.error}>{error}</Text>}
        
        <TextInput
          label="Title"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
          disabled={!isEditing}
        />
        
        <TextInput
          label="Description"
          value={description}
          onChangeText={setDescription}
          style={styles.input}
          multiline
          numberOfLines={4}
          disabled={!isEditing}
        />
        
        <View style={styles.metaContainer}>
          <Text style={styles.metaLabel}>Created:</Text>
          <Text style={styles.metaValue}>
            {new Date(task.createdAt).toLocaleString()}
          </Text>
        </View>
        
        {task.updatedAt && task.updatedAt !== task.createdAt && (
          <View style={styles.metaContainer}>
            <Text style={styles.metaLabel}>Last Updated:</Text>
            <Text style={styles.metaValue}>
              {new Date(task.updatedAt).toLocaleString()}
            </Text>
          </View>
        )}
        
        {isEditing && (
          <View style={styles.buttonContainer}>
            <Button 
              mode="outlined" 
              onPress={() => {
                setIsEditing(false);
                setTitle(task.title);
                setDescription(task.description || '');
              }} 
              style={styles.button}
              disabled={loading}
            >
              Cancel
            </Button>
            
            <Button 
              mode="contained" 
              onPress={handleSave} 
              style={styles.button}
              loading={loading}
              disabled={loading}
            >
              Save
            </Button>
          </View>
        )}
      </Surface>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  surface: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    elevation: 4,
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'transparent',
  },
  metaContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  metaLabel: {
    fontWeight: 'bold',
    marginRight: 8,
    color: '#666',
  },
  metaValue: {
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  button: {
    width: '45%',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default TaskDetailsScreen;