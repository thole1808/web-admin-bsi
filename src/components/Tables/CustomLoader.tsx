import React from 'react';
import styled, { keyframes } from 'styled-components';

const rotate360 = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.div<{ $grow?: number }>`
  margin: 16px;
  animation: ${rotate360} 1s linear infinite;
  transform: translateZ(0);
  border-top: 2px solid grey;
  border-right: 2px solid grey;
  border-bottom: 2px solid grey;
  border-left: 4px solid black;
  background: transparent;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  flex-grow: ${({ $grow }) => ($grow ? $grow : 0)};
`;

const CustomLoader: React.FC = () => (
  <div style={{ padding: '24px' }}>
    <Spinner $grow={1} />
    <div>Now loading...</div>
  </div>
);

export default CustomLoader;
