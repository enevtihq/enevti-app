import React from 'react';

function logPropDifferences(newProps: any, lastProps: any, identifier?: string) {
  let remounted = true;
  const allKeys = new Set(Object.keys(newProps).concat(Object.keys(lastProps)));
  allKeys.forEach(key => {
    const newValue = newProps[key];
    const lastValue = lastProps[key];
    if (newValue !== lastValue) {
      remounted = false;
      console.log(`${identifier ? '[' + identifier + '] - (new)' : '(new)'}`, key, newValue);
      console.log(`${identifier ? '[' + identifier + '] - (old)' : '(old)'}`, key, lastValue);
    }
  });
  if (remounted) {
    console.log(
      `${identifier ? '[' + identifier + '] - (warn) no prop change rerender' : '(warn) no prop change rerender'}`,
    );
  }
}

export default function useDebugPropChanges(newProps: any, identifier: string = '') {
  const lastProps = React.useRef();
  React.useEffect(() => {
    console.log(`${identifier ? '[' + identifier + '] - (info) mounted' : '(info) mounted'}`);
  }, [identifier]);
  if (lastProps.current) {
    logPropDifferences(newProps, lastProps.current, identifier);
  }
  lastProps.current = newProps;
}
