import React from 'react';
import { Edge, useSafeAreaInsets } from 'react-native-safe-area-context';
import { EdgeContext } from 'enevti-app/context';
import { SafeAreaInsets } from 'enevti-app/utils/layout/imageRatio';

export default function useSafeEdgeInsets(): SafeAreaInsets {
  const insets = useSafeAreaInsets();
  const edges = React.useContext(EdgeContext);
  if (edges !== undefined) {
    const ret = JSON.parse(JSON.stringify(insets));
    (['bottom', 'top', 'left', 'right'] as Edge[]).filter(x => !edges.includes(x)).forEach(x => (ret[x] = 0));
    return ret;
  } else {
    console.warn(
      'useSafeEdgeInsets resulted in undefined value, make sure you call this hook inside AppView / EdgeContext provider',
    );
    return insets;
  }
}
