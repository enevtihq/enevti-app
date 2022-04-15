import React from 'react';
import { Edge } from 'react-native-safe-area-context';

export const EdgeContext = React.createContext<Edge[] | undefined>(undefined);
export const BackgroundColorContext = React.createContext<string | undefined>(
  undefined,
);
export const ModalContext = React.createContext<boolean>(false);
