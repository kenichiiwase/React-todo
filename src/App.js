/* eslint-disable jsx-a11y/no-redundant-roles */
import React, { useState, useRef, useEffect } from "react";
import Form from "./components/Form";
import FilterButton from "./components/FilterButton";
import Todo from "./components/Todo";
import { db } from "./Firebase";

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const FILTER_MAP = {
  All: () => true,
  Active: (task) => !task.completed,
  Completed: (task) => task.completed,
};

// All,Active,Completed
const FILTER_NAMES = Object.keys(FILTER_MAP);

function App(props) {
  const [tasks, setTasks] = useState([{ id: "", name: "", completed: "" }]);
  // 初期表示時はAll
  const [filter, setFilter] = useState("All");
  useEffect(() => {
    const unSub = db.collection("Tasks").onSnapshot((snapshot) => {
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

  function toggleTaskCompleted(id) {
    const updatedTasks = tasks.map((task) => {
      // 編集されたタスクと同じIDを持っているIDを持っているか
      if (id === task.id) {
        db.collection("Tasks")
          .doc(id)
          .set({ completed: !task.completed }, { merge: true });
      }
      return task;
    });
    setTasks(updatedTasks);
  }

  function deleteTask(id) {
    db.collection("Tasks").doc(id).delete();
  }

  function editTask(id, newName) {
    const editedTaskList = tasks.map((task) => {
      // 編集されたタスクと同じIDを持っている場合
      if (id === task.id) {
        db.collection("Tasks").doc(id).set({ name: newName }, { merge: true });
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

  const filterList = FILTER_NAMES.map((name) => (
    <FilterButton
      key={name}
      name={name}
      isPressed={name === filter}
      setFilter={setFilter}
    />
  ));

  function addTask(name) {
    db.collection("Tasks").add({
      name: name,
      completed: false,
    });
  }

  const tasksNoun = taskList.length !== 1 ? "tasks" : "task";
  const headingText = `${taskList.length} ${tasksNoun} remaining`;

  const listHeadingRef = useRef(null);
  const prevTaskLength = usePrevious(tasks.length);

  useEffect(() => {
    if (tasks.length - prevTaskLength === -1) {
      listHeadingRef.current.focus();
    }
  }, [tasks.length, prevTaskLength]);

  return (
    <div className="todoapp stack-large">
      <Form addTask={addTask} />
      <div className="filters btn-group stack-exception">{filterList}</div>
      <h2 id="list-heading" tabIndex="-1" ref={listHeadingRef}>
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
