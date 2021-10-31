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
import { Flex, Heading, Box, createStandaloneToast } from '@chakra-ui/react';
const toast = createStandaloneToast();

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
      try {
        setTasks(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            name: doc.data().name,
            completed: doc.data().completed,
          }))
        );
      } catch {
        toast({
          title: 'db取得エラー。ネットワーク接続を見直してください',
        });
      }
    });
    return () => unSub();
  }, []);

  function toggleTaskCompleted(id: string) {
    const updatedTasks = tasks.map((task) => {
      // 編集されたタスクと同じIDを持っているIDを持っているか
      if (id === task.id) {
        try {
          const taskRef = doc(db, 'Tasks', id);
          setDoc(taskRef, { completed: !task.completed }, { merge: true });
        } catch {
          toast({
            title: 'db更新エラー。ネットワーク接続を見直してください',
          });
        }
      }
      return task;
    });
    setTasks(updatedTasks);
  }

  async function deleteTask(id: string) {
    try {
      await deleteDoc(doc(db, 'Tasks', id));
    } catch (e) {
      toast({
        title: 'db削除エラー。ネットワーク接続を見直してください',
      });
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
      toast({
        title: 'db更新エラー。ネットワーク接続を見直してください',
      });

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
      toast({
        title: 'db登録エラー。ネットワーク接続を見直してください',
      });
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
    <Flex height="100vh" justify="center">
      <div>
        <Flex direction="column" background="white" p={12} rounded={6}>
          <Heading mb={8}>
            <Form addTask={addTask} />
          </Heading>
          <div>{filterList}</div>
          <Box
            bgGradient="linear(to-l, #c2ca28, #28caca)"
            bgClip="text"
            fontSize="4xl"
            fontWeight="extrabold"
            ref={listHeadingRef}
          >
            {headingText}
          </Box>
          <ul role="list" aria-labelledby="list-heading">
            {taskList}
          </ul>
        </Flex>
      </div>
    </Flex>
  );
}

export default App;
