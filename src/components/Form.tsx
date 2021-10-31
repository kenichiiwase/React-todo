import React, { useState } from 'react';
import { Button, Box, Input } from '@chakra-ui/react';

type formProps = {
  addTask(name: string): void;
};

function Form(props: formProps) {
  const [name, setName] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) {
      return;
    }
    props.addTask(name);
    setName('');
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setName(event.target.value);
  }

  return (
    <form onSubmit={handleSubmit}>
      <Box
        bgGradient="linear(to-l, #43ca28, #28caca)"
        bgClip="text"
        fontSize="6xl"
        fontWeight="extrabold"
        mb="30px"
      >
        Todo-App
      </Box>

      <Input
        type="text"
        name="text"
        autoComplete="off"
        value={name}
        onChange={handleChange}
        w={500}
        border="2px"
        variant="outline"
        placeholder="Input task here"
      />
      <Button
        type="submit"
        background={'cyan.500'}
        color={'white'}
        ml="10px"
        mt="5px"
      >
        Add
      </Button>
    </form>
  );
}

export default Form;
