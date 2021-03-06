import { COIN_NAME } from 'enevti-app/utils/constant/identifier';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import {
  setPaymentFee,
  setPaymentStatus,
  setPaymentAction,
  showPayment,
  setPaymentPriority,
} from 'enevti-app/store/slices/payment';
import { CreateNFTOneKindMeta } from 'enevti-app/types/ui/store/CreateNFTQueue';
import { AsyncThunkAPI } from 'enevti-app/store/state';
import { attachFee, calculateBaseFee, calculateGasFee, createTransaction } from 'enevti-app/service/enevti/transaction';
import { makeDummyIPFS } from 'enevti-app/utils/dummy/ipfs';
import i18n from 'enevti-app/translations/i18n';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { handleError } from 'enevti-app/utils/error/handle';
import { CreateOneKindNFTUI } from 'enevti-app/types/core/asset/redeemable_nft/create_onekind_nft_asset';
import generateRandomKey from 'enevti-app/utils/passphrase';
import { encryptAsymmetric, createSignature, encryptFile } from 'enevti-app/utils/cryptography';
import { getMyPublicKey } from 'enevti-app/service/enevti/persona';
import { AppTransaction } from 'enevti-app/types/core/service/transaction';
import { redeemableNftModule } from 'enevti-app/utils/constant/transaction';
import RNFS from 'react-native-fs';
import { completeTokenUnit } from 'enevti-app/utils/format/amount';

export const payCreateNFTOneKind = createAsyncThunk<void, CreateNFTOneKindMeta, AsyncThunkAPI>(
  'onekind/payCreateNFTOneKind',
  async (payload, { dispatch, signal }) => {
    try {
      dispatch(
        setPaymentStatus({
          id: payload.key,
          key: payload.key,
          action: 'createNFTOneKind',
          type: 'initiated',
          message: '',
        }),
      );
      dispatch(showPayment());

      const now = new Date();

      let data = '',
        cover = '',
        coverMime = '',
        coverExtension = '',
        coverSize = 0;

      if (payload.state.storageProtocol === 'ipfs') {
        data = makeDummyIPFS();
        cover = payload.state.coverUri ? makeDummyIPFS() : data;
      }

      coverMime = payload.state.coverUri ? payload.state.coverType : payload.data.mime;
      coverExtension = payload.state.coverUri ? payload.state.coverExtension : payload.data.extension;
      coverSize = payload.state.coverUri ? payload.state.coverSize : payload.data.size;

      let content = '',
        contentMime = '',
        contentExtension = '',
        cipher = '',
        plainSignature = '',
        cipherSignature = '',
        contentIv = '',
        contentSalt = '',
        contentSecurityVersion = 0,
        contentUri = payload.state.contentUri;
      let contentSize: number = 0;

      if (payload.state.utility === 'content') {
        const randomKey = await generateRandomKey();
        const myPublicKey = await getMyPublicKey();
        const encryptedFile = await encryptFile(payload.state.contentUri, randomKey);
        if (encryptedFile.status === 'error') {
          throw Error(i18n.t('error:transactionPreparationFailed'));
        }

        cipher = await encryptAsymmetric(randomKey, myPublicKey);
        cipherSignature = await createSignature(cipher);
        plainSignature = await createSignature(randomKey);

        if (payload.state.storageProtocol === 'ipfs') {
          content = makeDummyIPFS();
        }

        contentMime = payload.state.contentType;
        contentExtension = payload.state.contentExtension;
        contentSize = (await RNFS.stat(encryptedFile.output)).size;
        contentIv = encryptedFile.iv;
        contentSalt = encryptedFile.salt;
        contentSecurityVersion = encryptedFile.version;
        contentUri = encryptedFile.output;
      }

      let until: number;
      if (payload.state.recurring !== 'anytime') {
        const dateFrom = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          payload.state.fromHour,
          payload.state.fromMinute,
        );
        const dateUntil = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          payload.state.untilHour,
          payload.state.untilMinute,
        );
        until = Math.floor(
          (dateUntil.getTime() + (dateUntil.getTime() < dateFrom.getTime() ? 86400000 : 0) - dateFrom.getTime()) / 1000,
        );
      } else {
        until = 0;
      }

      const mintingExpire =
        payload.state.mintingExpire !== '0'
          ? Math.floor((now.getTime() + parseInt(payload.state.mintingExpire, 10) * 86400000) / 1000)
          : 0;

      const transactionPayload: AppTransaction<CreateOneKindNFTUI> = await createTransaction<CreateOneKindNFTUI>(
        redeemableNftModule.moduleID,
        redeemableNftModule.createOnekindNft,
        {
          name: payload.state.name,
          description: payload.state.description,
          mintingType: payload.state.mintingType,
          symbol: payload.state.symbol,
          cover: cover,
          coverMime: coverMime,
          coverExtension: coverExtension,
          coverSize: coverSize,
          coverProtocol: payload.state.storageProtocol,
          data: data,
          dataMime: payload.data.mime,
          dataExtension: payload.data.extension,
          dataSize: payload.data.size,
          dataProtocol: payload.state.storageProtocol,
          utility: payload.state.utility,
          template: payload.choosenTemplate.id,
          cipher: cipher,
          signature: {
            cipher: cipherSignature,
            plain: plainSignature,
          },
          content: content,
          contentMime: contentMime,
          contentExtension: contentExtension,
          contentSize: contentSize,
          contentProtocol: payload.state.storageProtocol,
          contentIv: contentIv,
          contentSalt: contentSalt,
          contentSecurityVersion: contentSecurityVersion,
          recurring: payload.state.recurring,
          time: {
            day: payload.state.timeDay,
            date: payload.state.timeDate,
            month: payload.state.timeMonth,
            year: payload.state.timeYear,
          },
          from: {
            hour: payload.state.fromHour,
            minute: payload.state.fromMinute,
          },
          until: until,
          redeemLimit: payload.state.redeemLimit ? parseInt(payload.state.redeemLimit, 10) : 0,
          royalty: {
            creator: payload.state.royaltyCreator ? parseInt(payload.state.royaltyCreator, 10) : 0,
            staker: payload.state.royaltyStaker ? parseInt(payload.state.royaltyStaker, 10) : 0,
          },
          price: {
            amount: completeTokenUnit(payload.state.priceAmount),
            currency: payload.state.priceCurrency,
          },
          quantity: payload.state.quantity ? parseInt(payload.state.quantity, 10) : 0,
          mintingExpire: mintingExpire,
        },
        '0',
        signal,
      );

      const baseFee = await calculateBaseFee(transactionPayload, signal);
      if (!baseFee) {
        throw Error(i18n.t('error:transactionPreparationFailed'));
      }
      const gasFee = await calculateGasFee(attachFee(transactionPayload, baseFee), signal);
      if (!gasFee) {
        throw Error(i18n.t('error:transactionPreparationFailed'));
      }

      dispatch(setPaymentFee({ gas: gasFee, base: baseFee, platform: '0' }));
      dispatch(setPaymentPriority('normal'));
      dispatch(
        setPaymentAction({
          type: 'createNFTOneKind',
          icon: iconMap.nftOneKind,
          name: i18n.t('payment:payCreateNFTOneKindName'),
          description: i18n.t('payment:payCreateNFTOneKindDescription'),
          amount: '0',
          currency: COIN_NAME,
          payload: JSON.stringify(attachFee(transactionPayload, (BigInt(gasFee) + BigInt(baseFee)).toString())),
          meta: JSON.stringify(Object.assign(payload, { state: Object.assign(payload.state, { contentUri }) })),
        }),
      );
    } catch (err) {
      handleError(err);
      dispatch(
        setPaymentStatus({
          id: payload.key,
          key: payload.key,
          action: 'createNFTOneKind',
          type: 'error',
          message: (err as Record<string, any>).message.toString(),
        }),
      );
    }
  },
);
