// TaskContext.js
import React, { createContext, useContext, useState } from 'react';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [checkedTasks, setCheckedTasks] = useState([]);

  const toggleTaskCheckbox = (taskId) => {
    if (checkedTasks.includes(taskId)) {
      setCheckedTasks((prevOrder) => prevOrder.filter(id => id !== taskId));
    } else {
      setCheckedTasks((prevOrder) => [...prevOrder, taskId]);
    }
  };
  return (
    <TaskContext.Provider value={ { checkedTasks, setCheckedTasks, toggleTaskCheckbox } }>
      { children }
    </TaskContext.Provider>
  );
};
