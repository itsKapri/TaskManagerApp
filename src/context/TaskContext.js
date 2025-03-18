import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

export const TaskContext = createContext();


export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    } else {
      setTasks([]);
    }
  }, [isAuthenticated]);

const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
  
      const token = await AsyncStorage.getItem('Authorization');
      if (!token) {
        throw new Error("No authorization token found");
      }
  
      const response = await axios.get(`${API_URL}/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      setTasks(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching tasks');
      console.log('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };
  

const getTask = async (id) => {
    try {
      setLoading(true);
      setError(null);
  
      const token = await AsyncStorage.getItem('Authorization');
      if (!token) {
        throw new Error("No authorization token found");
      }
  
      const response = await axios.get(`${API_URL}/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching task');
      console.log('Error fetching task:', err);
      throw err;
    } finally {
      setLoading(false);
    }
};
  

const createTask = async ({ title, description }) => {
    try {
        const token = await AsyncStorage.getItem('Authorization')
        if(token){
            const response = await axios.post(`${API_URL}/tasks`, 
                { title: title, description: description }, 
                { headers: { 
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                 } }
            );
            console.log("Task created:", response.data);
        }
    
    } catch (error) {
        console.error("Error creating task:", error.response?.data || error.message);
    }
};
  

const updateTask = async (id, taskData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.put(`${API_URL}/tasks/${id}`, taskData);
      
      setTasks(tasks.map(task => 
        task._id === id ? response.data : task
      ));
      
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating task');
      console.log('Error updating task:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await axios.delete(`${API_URL}/tasks/${id}`);
      
      setTasks(tasks.filter(task => task._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting task');
      console.log('Error deleting task:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        error,
        fetchTasks,
        getTask,
        createTask,
        updateTask,
        deleteTask
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};