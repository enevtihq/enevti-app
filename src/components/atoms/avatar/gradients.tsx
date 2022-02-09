import React from 'react';
import { Defs, Stop, LinearGradient } from 'react-native-svg';
import gradSpecs from './grandient-config.json';

const addUrl = (spec: any) => ({
  ...spec,
  url: `url(#${spec.id})`,
});

export const gradientSchemes = gradSpecs.map(spec => ({
  primary: spec.primary.map(addUrl),
  secondary: spec.secondary.map(addUrl),
}));

// rotation={spec.rotate} origin='100, 100'
const getCoordinations = (slope: number) => {
  // normalize the +/- sign
  const deg = (slope + 360) % 360;
  const rad = Math.atan(deg / 180);
  const coords = {
    x1: '10%',
    y1: '10%',
    x2: `${100 * Math.sin(rad - Math.PI / 2)}%`,
    y2: `${100 * Math.cos(rad - Math.PI / 2)}%`,
  };

  return coords;
};

export const Gradients = ({ scheme }: any) => (
  <Defs>
    {[...scheme.primary, ...scheme.secondary].map(spec => (
      <LinearGradient
        id={spec.id}
        key={spec.id}
        {...getCoordinations(spec.rotate)}>
        {spec.colors.map((color: string, i: number) => (
          <Stop
            stopColor={color}
            offset={`${i * (100 / (spec.colors.length - 1))}%`}
            key={i}
          />
        ))}
      </LinearGradient>
    ))}
  </Defs>
);
