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

const defaultTreshold = parseLastFetch(10, 'minute');

export const lastFetchTreshold = {
  persona: defaultTreshold,
  profile: defaultTreshold,
};
