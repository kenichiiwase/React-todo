/* eslint-disable jsx-a11y/no-redundant-roles */
import React, { useState, useRef, useEffect } from 'react';
import Form from './Form';
import FilterButton from './FilterButton';
import Todo from './Todo';
import {
  collection,
  onSnapshot,
  setDoc,
  deleteDoc,
  addDoc,
  doc,
} from 'firebase/firestore';
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
const FILTER_KEYS = ['All', 'Active', 'Completed'] as const;

type FILTER_UNION = typeof FILTER_KEYS[number];

const FILTER_MAP: {
  [FILTER_KEYS in FILTER_UNION]: (task: { completed: boolean }) => boolean;
} = {
  All: () => true,
  Active: (task: { completed: boolean }) => !task.completed,
  Completed: (task: { completed: boolean }) => task.completed,
};

function App() {
  const [tasks, setTasks] = useState([{ id: '', name: '', completed: true }]);
  // 初期表示時はAll
  // stringでなくunionでないとだめ'All'|'Active'|'Completed'
  const [filter, setFilter] = useState<'All' | 'Active' | 'Completed'>('All');

  useEffect(() => {
    const unSub = onSnapshot(collection(db, 'Tasks'), (snapshot) => {
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

  function toggleTaskCompleted(id: string) {
    const updatedTasks = tasks.map((task) => {
      // 編集されたタスクと同じIDを持っているIDを持っているか
      if (id === task.id) {
        const taskRef = doc(db, 'Tasks', id);
        setDoc(taskRef, { completed: !task.completed }, { merge: true });
      }
      return task;
    });
    setTasks(updatedTasks);
  }

  async function deleteTask(id: string) {
    try {
      await deleteDoc(doc(db, 'Tasks', id));
    } catch (e) {
      console.error(
        'error：',
        'db削除エラー。ネットワーク環境を見直してください。'
      );
    }
  }

  async function editTask(id: string, newName: string) {
    let oldName = 'oldName';
    // この関数を実行したときに実行した瞬間のTasksがわたってくる。
    setTasks((s) =>
      s.map((task) => {
        if (task.id === id) {
          oldName = task.name;
          return { ...task, name: newName };
        }
        return task;
      })
    );
    try {
      const taskRef = doc(db, 'Tasks', id);
      await setDoc(taskRef, { name: newName }, { merge: true });
    } catch (e) {
      console.error(
        'error：',
        'db更新エラー。ネットワーク環境を見直してください。'
      );

      setTasks((s) =>
        s.map((task) => {
          if (task.id === id) {
            return { ...task, name: oldName };
          }
          return task;
        })
      );
    }
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

  async function addTask(name: string) {
    try {
      await addDoc(collection(db, 'Tasks'), {
        name: name,
        completed: false,
      });
    } catch (e) {
      console.error(
        'error：',
        'db登録エラー。ネットワーク環境を見直してください。'
      );
    }
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
