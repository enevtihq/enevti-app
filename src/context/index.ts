import React from 'react';
import { Edge } from 'react-native-safe-area-context';

export const EdgeContext = React.createContext<Edge[] | undefined>(undefined);