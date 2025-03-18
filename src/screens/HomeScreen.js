import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { Text, FAB, Surface, ActivityIndicator, IconButton, Chip, Button } from 'react-native-paper';
import { TaskContext } from '../context/TaskContext';
import { AuthContext } from '../context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';

const HomeScreen = ({ navigation }) => {
  const { tasks, loading, error, fetchTasks } = useContext(TaskContext);
  const [refreshing, setRefreshing] = useState(false);
  const { logout,isAuthenticated } = useContext(AuthContext);

  useFocusEffect(
    React.useCallback(() => {
      fetchTasks();
      return () => {
      };
    }, [])
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button 
        mode="outlined" 
        onPress={() => {
           logout()
        }} 
        style={styles.button}
        disabled={loading}
      >
        Logout
      </Button>
      ),
    });
  }, [navigation]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTasks();
    setRefreshing(false);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      onPress={() => navigation.navigate('TaskDetails', { taskId: item._id })}
    >
      <Surface style={styles.taskItem}>
        <View style={styles.taskHeader}>
          <Text style={styles.taskTitle}>{item.title}</Text>
          <Chip mode="outlined" style={styles.statusChip}>
            {item.status || 'New'}
          </Chip>
        </View>
        <Text numberOfLines={2} style={styles.taskDescription}>
          {item.description}
        </Text>
        <View style={styles.taskFooter}>
          <Text style={styles.taskDate}>
            Created: {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </Surface>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {error && <Text style={styles.error}>{error}</Text>}
      
      {tasks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No tasks yet!</Text>
          <Text style={styles.emptySubtext}>Create your first task by tapping the + button</Text>
        </View>
      ) : (
        <FlatList
          data={tasks}
          renderItem={renderItem}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        />
      )}
      
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AddTask')}
      />
    </View>
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
  list: {
    padding: 16,
  },
  taskItem: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  statusChip: {
    marginLeft: 8,
  },
  taskDescription: {
    color: '#666',
    marginBottom: 8,
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskDate: {
    fontSize: 12,
    color: '#888',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emptySubtext: {
    textAlign: 'center',
    color: '#666',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    margin: 10,
  },
  button: {
    width: '100',
    borderWidth: 0, 
    borderColor: 'transparent', 
  }
});

export default HomeScreen;