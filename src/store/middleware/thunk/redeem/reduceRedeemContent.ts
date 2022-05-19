import {
  hideModalLoader,
  setModalLoaderText,
  showModalLoader,
  resetModalLoaderText,
} from 'enevti-app/store/slices/ui/global/modalLoader';
import { AppThunk } from 'enevti-app/store/state';
import { STORAGE_PATH_REDEEM, IOS_TEMP_FOLDER } from 'enevti-app/utils/constant/storage';
import { handleError } from 'enevti-app/utils/error/handle';
import {
  decryptAsymmetric,
  decryptFile,
  ENCRYPTED_FILE_EXTENSION,
  verifySignature,
} from 'enevti-app/utils/cryptography';
import RNFS from 'react-native-fs';
import { IPFStoURL } from 'enevti-app/service/ipfs';
import FileViewer from 'react-native-file-viewer';
import { NFT } from 'enevti-app/types/core/chain/nft';
import { appFetchBlob } from 'enevti-app/utils/network';
import i18n from 'enevti-app/translations/i18n';

function downloadError(nft: NFT) {
  throw Error(`Content Download Failed: ${nft.id}`);
}

function secretDecryptionFailed(nft: NFT) {
  throw Error(`Secret Decryption Failed: ${nft.id}`);
}

function fileDecryptionFailed(nft: NFT) {
  throw Error(`File Decryption Failed: ${nft.id}`);
}

function invalidCipherSignature(nft: NFT) {
  throw Error(`Invald Cipher Signature: ${nft.id}`);
}

function invalidPlainSignature(nft: NFT) {
  throw Error(`Invald Plain Signature: ${nft.id}`);
}

async function redeemDone(nft: NFT) {
  const localDecryptedFile = `${STORAGE_PATH_REDEEM}/${nft.symbol}#${nft.serial}.${nft.redeem.content.extension}`;
  await RNFS.unlink(localDecryptedFile);
  if (await RNFS.exists(`${STORAGE_PATH_REDEEM}/${IOS_TEMP_FOLDER}`)) {
    await RNFS.unlink(`${STORAGE_PATH_REDEEM}/${IOS_TEMP_FOLDER}`);
  }
}

export const reduceRedeemContent =
  (nft: NFT): AppThunk =>
  async dispatch => {
    try {
      dispatch(showModalLoader());
      dispatch({ type: 'redeem/reduceRedeemContent' });

      if (!(await RNFS.exists(STORAGE_PATH_REDEEM))) {
        await RNFS.mkdir(STORAGE_PATH_REDEEM);
      }

      const localEncryptedFile = `${STORAGE_PATH_REDEEM}/${nft.symbol}#${nft.serial}.${ENCRYPTED_FILE_EXTENSION}`;
      const localDecryptedFile = `${STORAGE_PATH_REDEEM}/${nft.symbol}#${nft.serial}.${nft.redeem.content.extension}`;

      dispatch(setModalLoaderText(i18n.t('nftDetails:verifyingOwnership')));
      const isCipherSignatureValid = await verifySignature(
        nft.redeem.secret.cipher,
        nft.redeem.secret.signature.cipher,
        nft.redeem.secret.sender,
      );
      if (!isCipherSignatureValid) {
        invalidCipherSignature(nft);
      }

      const decryptedSecret = await decryptAsymmetric(nft.redeem.secret.cipher, nft.redeem.secret.sender);
      if (decryptedSecret.status === 'error') {
        secretDecryptionFailed(nft);
      }

      const isPlainSignatureValid = await verifySignature(
        decryptedSecret.data,
        nft.redeem.secret.signature.plain,
        nft.redeem.secret.sender,
      );
      if (!isPlainSignatureValid) {
        invalidPlainSignature(nft);
      }

      if (!(await RNFS.exists(localEncryptedFile))) {
        dispatch(setModalLoaderText(i18n.t('nftDetails:downloading')));
        await appFetchBlob(IPFStoURL(nft.redeem.content.cid), { path: localEncryptedFile });
        const contentSize = (await RNFS.stat(localEncryptedFile)).size;
        if (contentSize !== nft.redeem.content.size) {
          await RNFS.unlink(localEncryptedFile);
          downloadError(nft);
        }
      }

      dispatch(setModalLoaderText(i18n.t('nftDetails:redeemingSecretContent')));
      const decryptedFile = await decryptFile(
        localEncryptedFile,
        decryptedSecret.data,
        nft.redeem.content.iv,
        nft.redeem.content.salt,
        nft.redeem.content.version,
        localDecryptedFile,
      );
      if (decryptedFile.status === 'error') {
        fileDecryptionFailed(nft);
      }

      await FileViewer.open(localDecryptedFile, {
        onDismiss: async () => {
          await redeemDone(nft);
          dispatch(hideModalLoader());
        },
      });
    } catch (err) {
      handleError(err);
      dispatch(hideModalLoader());
    } finally {
      dispatch(resetModalLoaderText());
    }
  };
