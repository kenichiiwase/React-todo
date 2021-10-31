import React, { useEffect, useRef, useState } from 'react';
import { Button, Stack, Input, Box, Checkbox } from '@chakra-ui/react';

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
    <form onSubmit={handleSubmit}>
      <div>
        <Input
          value={newName || props.name}
          onChange={handleChange}
          ref={editFieldRef}
          variant="unstyled"
          w={555}
          fontSize="30"
          mb="30px"
        />
      </div>
      <div>
        <Stack direction="row" spacing={14}>
          <Button
            background={'cyan.400'}
            color={'white'}
            variant="solid"
            w={250}
            onClick={() => setEditMode(false)}
          >
            Cancel
          </Button>
          <Button
            background={'cyan.400'}
            color={'white'}
            variant="solid"
            w={250}
            type="submit"
            disabled={isSaving}
          >
            Save
          </Button>
        </Stack>
      </div>
    </form>
  );

  // 更新中でない場合
  const viewTemplate = (
    <div>
      <div>
        <Checkbox
          colorScheme="green"
          id={props.id}
          defaultChecked={props.completed}
          onChange={() => props.toggleTaskCompleted(props.id)}
        >
          <Input variant="unstyled" w={555} />
          <Box htmlFor={props.id} fontSize="30" mb="30px">
            {props.name}
          </Box>
        </Checkbox>
      </div>
      <div>
        <Stack direction="row" spacing={14}>
          <Button
            background={'green.400'}
            color={'white'}
            variant="solid"
            w={250}
            onClick={() => setEditMode(true)}
            ref={editButtonRef}
          >
            Edit
          </Button>
          <Button
            background={'green.400'}
            color={'white'}
            variant="solid"
            w={250}
            onClick={() => delSubmit()}
          >
            Delete
          </Button>
        </Stack>
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

  return <Box>{editMode ? editingTemplate : viewTemplate}</Box>;
}
