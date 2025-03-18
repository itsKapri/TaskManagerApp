import React, { useState, useContext } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text, Surface } from 'react-native-paper';
import { TaskContext } from '../context/TaskContext';

const AddTaskScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { createTask, loading, error } = useContext(TaskContext);

  const handleCreateTask = async () => {
    if (!title) {
      alert('Please enter a task title');
      return;
    }
    
    try {
      await createTask({ title, description });
      navigation.goBack();
    } catch (err) {
      // Error is handled in TaskContext
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.surface}>
        <Text style={styles.title}>Create New Task</Text>
        
        {error && <Text style={styles.error}>{error}</Text>}
        
        <TextInput
          label="Title"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
        />
        
        <TextInput
          label="Description"
          value={description}
          onChangeText={setDescription}
          style={styles.input}
          multiline
          numberOfLines={4}
        />
        
        <View style={styles.buttonContainer}>
          <Button 
            mode="outlined" 
            onPress={() => navigation.goBack()} 
            style={styles.button}
            disabled={loading}
          >
            Cancel
          </Button>
          
          <Button 
            mode="contained" 
            onPress={handleCreateTask} 
            style={styles.button}
            loading={loading}
            disabled={loading}
          >
            Create Task
          </Button>
        </View>
      </Surface>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  surface: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'transparent',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
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

export default AddTaskScreen;