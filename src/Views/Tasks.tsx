import React from 'react';
import Centered from '../Styled/Layouts';

export type TasksProps = {
  title?: string;
};

const Tasks: React.FC<TasksProps> = () => {
  return <Centered>Tasks</Centered>;
};

export default Tasks;
