import React from 'react';

type filterProps = {
  isPressed: any;
  name: 'All' | 'Active' | 'Completed';
  setFilter(name: 'All' | 'Active' | 'Completed'): void;
};

function FilterButton(props: filterProps) {
  return (
    <button
      type="button"
      className="btn toggle-btn"
      aria-pressed={props.isPressed}
      onClick={() => props.setFilter(props.name)}
    >
      <span className="visually-hidden">Show </span>
      <span>{props.name}</span>
      <span className="visually-hidden"> tasks</span>
    </button>
  );
}

export default FilterButton;
