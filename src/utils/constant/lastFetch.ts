const parseLastFetch = (value: number, unit: 'second' | 'minute' | 'hour') => {
  switch (unit) {
    case 'second':
      return value * 1000;
    case 'minute':
      return value * 1000 * 60;
    case 'hour':
      return value * 1000 * 60 * 60;
  }
};

const defaultTimeout = parseLastFetch(10, 'minute');

export const lastFetchTimeout = {
  persona: defaultTimeout,
  profile: defaultTimeout,
  profileOwned: defaultTimeout,
  profileCollection: defaultTimeout,
  display: parseLastFetch(15, 'minute'),
  home: defaultTimeout,
  request: parseLastFetch(10, 'second'),
};
