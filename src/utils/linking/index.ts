type AppLinkNamespace = 'nft-serial';

const APP_LINK = 'enevti://';

export function getAppLink(namespace: AppLinkNamespace, arg: string) {
  let ret: string = '';
  switch (namespace) {
    case 'nft-serial':
      ret = `${APP_LINK}nft/${arg}`;
      break;
    default:
      break;
  }
  return ret;
}
