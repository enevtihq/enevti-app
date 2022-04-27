import { COIN_NAME } from 'enevti-app/utils/constant/identifier';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import {
  setPaymentFee,
  setPaymentStatus,
  setPaymentAction,
  showPayment,
} from 'enevti-app/store/slices/payment';
import { CreateNFTOneKind } from 'enevti-app/types/ui/store/CreateNFTQueue';
import { AsyncThunkAPI } from 'enevti-app/store/state';
import { calculateGasFee, createTransaction } from 'enevti-app/service/enevti/transaction';
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

export const payCreateNFTOneKind = createAsyncThunk<void, CreateNFTOneKind, AsyncThunkAPI>(
  'onekind/payCreateNFTOneKind',
  async (payload, { dispatch, signal }) => {
    try {
      dispatch(setPaymentStatus({ type: 'initiated', message: '' }));
      dispatch(showPayment());

      const data = makeDummyIPFS();
      const cover = payload.state.coverUri ? makeDummyIPFS() : '';
      const coverMime = payload.state.coverUri ? payload.state.coverType : '';
      const coverExtension = payload.state.coverUri ? payload.state.coverExtension : '';
      const coverSize = payload.state.coverUri ? payload.state.coverSize : -1;

      let content = '',
        contentMime = '',
        contentExtension = '',
        cipher = '',
        signature = '',
        contentIv = '',
        contentSalt = '',
        contentSecurityVersion = 0,
        contentUri = payload.state.contentUri;
      let contentSize: number = -1;

      if (payload.state.utility === 'content') {
        content = makeDummyIPFS();
        contentMime = payload.state.contentType;
        contentExtension = payload.state.contentExtension;
        contentSize = payload.state.contentSize;

        const randomKey = await generateRandomKey();
        const myPublicKey = await getMyPublicKey();
        cipher = await encryptAsymmetric(randomKey, myPublicKey);
        signature = await createSignature(randomKey);

        const encryptedFile = await encryptFile(payload.state.contentUri, randomKey);
        contentIv = encryptedFile.iv;
        contentSalt = encryptedFile.salt;
        contentSecurityVersion = encryptedFile.version;
        contentUri = encryptedFile.output;
      }

      let until: number;
      if (payload.state.recurring !== 'anytime') {
        const now = new Date();
        const dateFrom = Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate(),
          payload.state.fromHour,
          payload.state.fromMinute,
        );
        const dateUntil = Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate(),
          payload.state.untilHour,
          payload.state.untilMinute,
        );
        until = dateUntil + (dateUntil < dateFrom ? 86400000 : 0) - dateFrom;
      } else {
        until = 0;
      }
      const transactionPayload: AppTransaction<CreateOneKindNFTUI> =
        await createTransaction<CreateOneKindNFTUI>(
          redeemableNftModule.moduleID,
          redeemableNftModule.createOnekindNft,
          {
            name: payload.state.name,
            description: payload.state.description,
            symbol: payload.state.symbol,
            cover: cover,
            coverMime: coverMime,
            coverExtension: coverExtension,
            coverSize: coverSize,
            data: data,
            dataMime: payload.data.mime,
            dataExtension: payload.data.extension,
            dataSize: payload.data.size,
            utility: payload.state.utility,
            template: payload.choosenTemplate.id,
            cipher: cipher,
            signature: signature,
            content: content,
            contentMime: contentMime,
            contentExtension: contentExtension,
            contentSize: contentSize,
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
            redeemLimit: parseInt(payload.state.redeemLimit, 10),
            royalty: {
              creator: parseInt(
                payload.state.royaltyCreator ? payload.state.royaltyCreator : '0',
                10,
              ),
              staker: parseInt(payload.state.royaltyStaker ? payload.state.royaltyStaker : '0', 10),
            },
            price: {
              amount: payload.state.priceAmount,
              currency: payload.state.priceCurrency,
            },
            quantity: parseInt(payload.state.quantity, 10),
            mintingExpire: parseInt(payload.state.mintingExpire, 10),
          },
          '0',
          signal,
        );
      const gasFee = await calculateGasFee(transactionPayload, signal);
      if (!gasFee) {
        throw Error(i18n.t('eror:transactionPreparationFailed'));
      }

      dispatch(setPaymentFee({ gas: gasFee, platform: '0' }));
      dispatch(
        setPaymentAction({
          type: 'createNFTOneKind',
          icon: iconMap.nftOneKind,
          name: i18n.t('payment:payCreateNFTOneKindName'),
          description: i18n.t('payment:payCreateNFTOneKindDescription'),
          amount: '0',
          currency: COIN_NAME,
          payload: JSON.stringify(
            Object.assign(payload, {
              transaction: transactionPayload,
              state: Object.assign(payload.state, { contentUri }),
            }),
          ),
        }),
      );
    } catch (err) {
      handleError(err);
      dispatch(
        setPaymentStatus({
          type: 'error',
          message: (err as Record<string, any>).message.toString(),
        }),
      );
    }
  },
);
