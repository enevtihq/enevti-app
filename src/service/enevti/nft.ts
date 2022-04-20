import ImageCropPicker from 'react-native-image-crop-picker';
import { handleError } from 'enevti-app/utils/error/handle';
import { NFT } from 'enevti-app/types/core/chain/nft';
import sleep from 'enevti-app/utils/dummy/sleep';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import { getDummyNFTFullData } from './dummy';

type NFTDetailsRoute = StackScreenProps<
  RootStackParamList,
  'NFTDetails'
>['route']['params'];

export const NFT_RESOLUTION = 500;

export function cleanTMPImage() {
  ImageCropPicker.clean().catch(e => {
    handleError(e);
  });
}

export async function isNameAvailable(
  name: string,
  signal?: AbortController['signal'],
): Promise<boolean> {
  await sleep(1000, signal);
  console.log(name);
  return true;
}

export async function isSymbolAvailable(
  name: string,
  signal?: AbortController['signal'],
): Promise<boolean> {
  await sleep(1000, signal);
  console.log(name);
  return true;
}

async function fetchNFTbyId(
  id: string,
  signal?: AbortController['signal'],
): Promise<NFT | undefined> {
  await sleep(1000, signal);

  const ret = getDummyNFTFullData();
  ret.id = id;

  return ret;
}

async function fetchNFTbySymbol(
  symbol: string,
  serial: string,
  signal?: AbortController['signal'],
): Promise<NFT | undefined> {
  await sleep(1000, signal);

  const ret = getDummyNFTFullData();
  ret.symbol = symbol;
  ret.serial = serial;

  return ret;
}

export async function getNFTbyId(
  id: string,
  signal?: AbortController['signal'],
): Promise<NFT | undefined> {
  return await fetchNFTbyId(id, signal);
}

export async function getNFTbyRouteParam(
  routeParam: NFTDetailsRoute,
  signal?: AbortController['signal'],
) {
  switch (routeParam.mode) {
    case 's':
      const symbol = routeParam.arg.split('#')[0];
      const serial = routeParam.arg.split('#')[1];
      return await fetchNFTbySymbol(symbol, serial, signal);
    case 'id':
      return await fetchNFTbyId(routeParam.arg, signal);
    default:
      return await fetchNFTbyId(routeParam.arg, signal);
  }
}
