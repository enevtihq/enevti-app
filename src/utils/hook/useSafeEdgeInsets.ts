import React from 'react';
import { Edge, useSafeAreaInsets } from 'react-native-safe-area-context';
import { EdgeContext } from 'enevti-app/context';
import { SafeAreaInsets } from 'enevti-app/utils/imageRatio';

export default function useSafeEdgeInsets(): SafeAreaInsets {
  const insets = useSafeAreaInsets();
  const edges = React.useContext(EdgeContext);
  if (edges) {
    const ret = JSON.parse(JSON.stringify(insets));
    (['bottom', 'top', 'left', 'right'] as Edge[])
      .filter(x => !edges.includes(x))
      .forEach(x => (ret[x] = 0));
    return ret;
  } else {
    return insets;
  }
}
