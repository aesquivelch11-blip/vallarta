import React, { createContext, useContext } from 'react';
import { AmbientColors } from './dashboardData';

const defaultColors: AmbientColors = {
  canvas: '#faf8f5',
  accent: '#2b3b32',
  surface: '#f2ece4',
};

const AmbientContext = createContext<AmbientColors>(defaultColors);

export const AmbientProvider = AmbientContext.Provider;
export const useAmbient = () => useContext(AmbientContext);