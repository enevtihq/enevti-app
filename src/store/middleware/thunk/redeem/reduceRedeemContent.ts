import {
  hideModalLoader,
  showModalLoader,
} from 'enevti-app/store/slices/ui/global/modalLoader';
import { AppThunk } from 'enevti-app/store/state';
import { NFT } from 'enevti-app/types/nft';
import { STORAGE_PATH_REDEEM } from 'enevti-app/utils/constant/storage';
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

function secretDecryptionFailed(nft: NFT) {
  throw Error(`Secret Decryption Failed: ${nft.id}`);
}

function fileDecryptionFailed(nft: NFT) {
  throw Error(`File Decryption Failed: ${nft.id}`);
}

function invalidSignature(nft: NFT) {
  throw Error(`Invald Signature: ${nft.id}`);
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

      const localEncryptedFile = `${STORAGE_PATH_REDEEM}/${nft.id}.${ENCRYPTED_FILE_EXTENSION}`;
      const localDecryptedFile = `${STORAGE_PATH_REDEEM}/${nft.id}.${nft.redeem.content.extension}`;

      const decryptedSecret = await decryptAsymmetric(
        nft.redeem.secret.cipher,
        nft.redeem.secret.signer,
      );
      if (decryptedSecret.status === 'error') {
        secretDecryptionFailed(nft);
      }

      const isSignatureValid = await verifySignature(
        decryptedSecret.data,
        nft.redeem.secret.signature,
        nft.redeem.secret.signer,
      );
      if (!isSignatureValid) {
        invalidSignature(nft);
      }

      await RNFS.downloadFile({
        fromUrl: IPFStoURL(nft.redeem.content.cid),
        toFile: localEncryptedFile,
      }).promise;

      const decryptedFile = await decryptFile(
        localEncryptedFile,
        decryptedSecret.data,
        nft.redeem.content.iv,
        nft.redeem.content.salt,
        localDecryptedFile,
      );
      if (decryptedFile.status === 'error') {
        fileDecryptionFailed(nft);
      }

      await RNFS.unlink(localEncryptedFile);
      await FileViewer.open(localDecryptedFile);

      console.log('finish');
    } catch (err) {
      handleError(err);
    } finally {
      dispatch(hideModalLoader());
    }
  };
