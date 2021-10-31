import React from 'react';
import { Button } from '@chakra-ui/react';

type filterProps = {
  isPressed: any;
  name: 'All' | 'Active' | 'Completed';
  setFilter(name: 'All' | 'Active' | 'Completed'): void;
};

function FilterButton(props: filterProps) {
  return (
    <Button
      borderColor="green.400"
      color="green.400"
      variant="outline"
      type="button"
      aria-pressed={props.isPressed}
      onClick={() => props.setFilter(props.name)}
      w="30%"
      h="40px"
      mr="15px"
      size="lg"
    >
      <span>{props.name}</span>
    </Button>
  );
}

export default FilterButton;
