import React from 'react';
import { View, Animated, ViewStyle } from 'react-native';
import Svg, { G } from 'react-native-svg';
import { Gradients, gradientSchemes } from './gradients';
import { getShape, getBackgroundCircle, pickTwo, getHashChunks, randomId, replaceUrlByHashOnScheme } from './utils';

interface AvatarProps {
  address: string;
  size?: number;
  scale?: number;
  translate?: number;
}

const Avatar = React.memo(({ address, size, scale, translate = 0 }: AvatarProps) => {
  let Wrapper: typeof View | typeof Animated.View = View;
  const uniqueSvgUrlHash = randomId();

  const scaleAttr: ViewStyle = {};
  if (scale) {
    Wrapper = Animated.View;
    scaleAttr.transform = [{ scaleX: scale }, { scaleY: scale }, { translateY: translate }, { translateX: translate }];
  }
  const canvasSize = 200;

  const addressHashChunks: any = getHashChunks(address);
  const gradientScheme = gradientSchemes[addressHashChunks[0].substr(1, 2) % gradientSchemes.length];

  const gradientsSchemesUrlsHashed = {
    primary: gradientScheme.primary.map((...rest: [any]) => replaceUrlByHashOnScheme(uniqueSvgUrlHash, ...rest)),
    secondary: gradientScheme.secondary.map((...rest: [any]) => replaceUrlByHashOnScheme(uniqueSvgUrlHash, ...rest)),
  };
  const primaryGradients = pickTwo(addressHashChunks[1], gradientsSchemesUrlsHashed.primary);
  const secondaryGradients = pickTwo(addressHashChunks[2], gradientsSchemesUrlsHashed.secondary);
  const shapes = [
    getBackgroundCircle(canvasSize, primaryGradients[0]),
    getShape(addressHashChunks[1], canvasSize, primaryGradients[1], 1),
    getShape(addressHashChunks[2], canvasSize, secondaryGradients[0], 0.23),
    getShape(addressHashChunks[3], canvasSize, secondaryGradients[1], 0.18),
  ];
  return (
    <Wrapper>
      <Svg viewBox={`0 0 ${canvasSize} ${canvasSize}`} preserveAspectRatio="none" height={size} width={size}>
        <Gradients scheme={gradientsSchemesUrlsHashed} />
        <G>
          {shapes.map((shape, i) => (
            <shape.component {...shape.props} key={`${i}-${shape.component.displayName}-${Math.random()}`} />
          ))}
        </G>
      </Svg>
    </Wrapper>
  );
});

export default Avatar;
