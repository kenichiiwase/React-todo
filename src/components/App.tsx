/* eslint-disable jsx-a11y/no-redundant-roles */
import React, { useState, useRef, useEffect } from 'react';
import Form from './Form';
import FilterButton from './FilterButton';
import Todo from './Todo';
import { db } from '../Firebase';

function usePrevious(value: number) {
  const ref = React.useRef(0);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

// All,Active,Completed
// as const readonly unionと同じ扱い
const FILTER_KEYS = ['All','Active','Completed'] as const;

type FILTER_UNION = typeof FILTER_KEYS[number];

const FILTER_MAP:{[FILTER_KEYS in FILTER_UNION]: any} = {
  All: () => true,
  Active: (task: { completed: boolean; }) => !task.completed,
  Completed: (task: { completed: boolean; }) => task.completed,
};

function App() {
  const [tasks, setTasks] = useState([{ id: '', name: '', completed: true }]);
  // 初期表示時はAll
  // stringでなくunionでないとだめ'All'|'Active'|'Completed'
  const [filter, setFilter] = useState<'All'|'Active'|'Completed'>('All');
  useEffect(() => {
    const unSub = db.collection('Tasks').onSnapshot((snapshot) => {
      setTasks(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          completed: doc.data().completed,
        }))
      );
    });
    return () => unSub();
  }, []);

  function toggleTaskCompleted(id:string) {
    const updatedTasks = tasks.map((task) => {
      // 編集されたタスクと同じIDを持っているIDを持っているか
      if (id === task.id) {
        db.collection('Tasks')
          .doc(id)
          .set({ completed: !task.completed }, { merge: true });
      }
      return task;
    });
    setTasks(updatedTasks);
  }

  function deleteTask(id:string) {
    db.collection('Tasks').doc(id).delete();
  }

  function editTask(id:string, newName:string) {
    const editedTaskList = tasks.map((task) => {
      // 編集されたタスクと同じIDを持っている場合
      if (id === task.id) {
        db.collection('Tasks').doc(id).set({ name: newName }, { merge: true });
      }
      return task;
    });
    setTasks(editedTaskList);
  }

  const taskList = tasks
    .filter(FILTER_MAP[filter])
    .map((task) => (
      <Todo
        id={task.id}
        name={task.name}
        completed={task.completed}
        key={task.id}
        toggleTaskCompleted={toggleTaskCompleted}
        deleteTask={deleteTask}
        editTask={editTask}
      />
    ));

  const filterList = FILTER_KEYS.map((name) => (
    <FilterButton
      key={name}
      name={name}
      isPressed={name === filter}
      setFilter={setFilter}
    />
  ));

  function addTask(name:string) {
    db.collection('Tasks').add({
      name: name,
      completed: false,
    });
  }

  const tasksNoun = taskList.length !== 1 ? 'tasks' : 'task';
  const headingText = `${taskList.length} ${tasksNoun} remaining`;

  const listHeadingRef = useRef(null);
  const prevTaskLength = usePrevious(tasks.length);
  useEffect(() => {
    if (prevTaskLength) {
      if (tasks.length - prevTaskLength === -1) {
          listHeadingRef.current.focus();
      }
    }
  }, [tasks.length, prevTaskLength]);

  return (
    <div className="todoapp stack-large">
      <Form addTask={addTask} />
      <div className="filters btn-group stack-exception">{filterList}</div>
      <h2 id="list-heading" ref={listHeadingRef}>
        {headingText}
      </h2>
      <ul
        role="list"
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading"
      >
        {taskList}
      </ul>
    </div>
  );
}

export default App;
