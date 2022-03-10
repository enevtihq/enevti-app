export default function propsEqualityCheck(
  object1: any,
  object2: any,
  additionalMessage?: string,
) {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);
  if (keys1.length !== keys2.length) {
    console.log('inqual in length', additionalMessage);
  }
  for (let key of keys1) {
    if (object1[key] !== object2[key]) {
      console.log('inequal in key:', key, additionalMessage);
    }
  }
}
