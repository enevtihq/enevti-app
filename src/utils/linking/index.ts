type AppLinkNamespace = 'nft';

const APP_LINK = 'enevti://';

export function getAppLink(namespace: AppLinkNamespace, arg: string) {
  let ret: string = '';
  switch (namespace) {
    case 'nft':
      ret = `${APP_LINK}nft/${arg}`;
      break;
    default:
      break;
  }
  return ret;
}
