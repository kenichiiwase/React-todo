import React, { useEffect, useRef, useState } from 'react';

function usePrevious(value: boolean) {
  const ref = useRef(false);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

type todoProps = {
  id: string;
  name: string;
  completed: boolean;
  key: string;
  toggleTaskCompleted(id: string): void;
  deleteTask(id: string): void;
  editTask(id: string, newName: string): void;
};

export default function Todo(props: todoProps) {
  const [editMode, setEditMode] = useState(false);
  const [newName, setNewName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const editFieldRef = useRef(null);
  const editButtonRef = useRef(null);

  const wasEditing = usePrevious(editMode);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setNewName(event.target.value);
  }

  async function delSubmit(): Promise<void> {
    props.deleteTask(props.id);
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault();
    if (!newName.trim()) {
      return;
    }
    setIsSaving(true);
    props.editTask(props.id, newName);
    setIsSaving(false);
    setNewName('');
    setEditMode(false);
  }

  // 更新中の場合
  const editingTemplate = (
    <form className="stack-small" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="todo-label" htmlFor={props.id}>
          New name for {props.name}
        </label>
        <input
          id={props.id}
          className="todo-text"
          type="text"
          value={newName || props.name}
          onChange={handleChange}
          ref={editFieldRef}
        />
      </div>
      <div className="btn-group">
        <button
          type="button"
          className="btn todo-cancel"
          onClick={() => setEditMode(false)}
        >
          Cancel
          <span className="visually-hidden">renaming {props.name}</span>
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="btn btn__primary todo-edit"
        >
          Save
          <span className="visually-hidden">new name for {props.name}</span>
        </button>
      </div>
    </form>
  );

  // 更新中でない場合
  const viewTemplate = (
    <div className="stack-small">
      <div className="c-cb">
        <input
          id={props.id}
          type="checkbox"
          defaultChecked={props.completed}
          onChange={() => props.toggleTaskCompleted(props.id)}
        />
        <label className="todo-label" htmlFor={props.id}>
          {props.name}
        </label>
      </div>
      <div className="btn-group">
        <button
          type="button"
          className="btn"
          onClick={() => setEditMode(true)}
          ref={editButtonRef}
        >
          Edit <span className="visually-hidden">{props.name}</span>
        </button>
        <button
          type="button"
          className="btn btn__danger"
          onClick={() => delSubmit()}
        >
          Delete <span className="visually-hidden">{props.name}</span>
        </button>
      </div>
    </div>
  );

  useEffect(() => {
    if (!wasEditing && editMode) {
      editFieldRef.current.focus();
    }
    if (wasEditing && !editMode) {
      editButtonRef.current.focus();
    }
  }, [wasEditing, editMode]);

  return <li className="todo">{editMode ? editingTemplate : viewTemplate}</li>;
}
