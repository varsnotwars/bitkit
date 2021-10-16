/**
 * @format
 * @flow strict-local
 */

import React, {
	memo,
	PropsWithChildren,
	ReactElement,
	useCallback,
	useEffect,
} from 'react';
import { LayoutAnimation, StyleSheet } from 'react-native';
import { Text } from '../../styles/components';
import {
	resetOnChainTransaction,
	setupOnChainTransaction,
	updateOnChainTransaction,
	updateWalletBalance,
} from '../../store/actions/wallet';
import { useBalance, useTransactionDetails } from '../../hooks/transaction';
import Button from '../../components/Button';
import {
	broadcastTransaction,
	createTransaction,
	getTotalFee,
	updateFee,
} from '../../utils/wallet/transactions';
import {
	showErrorNotification,
	showSuccessNotification,
} from '../../utils/notifications';
import { useSelector } from 'react-redux';
import Store from '../../store/types';
import { useNavigation } from '@react-navigation/native';
import AdjustValue from '../../components/AdjustValue';
import FeeSummary from '../Wallets/SendOnChainTransaction/FeeSummary';
import useDisplayValues from '../../hooks/displayValues';
import { hasEnabledAuthentication } from '../../utils/settings';
import NavigationHeader from '../../components/NavigationHeader';
import { IGetOrderResponse } from '@synonymdev/blocktank-client';
import SafeAreaView from '../../components/SafeAreaView';

interface Props extends PropsWithChildren<any> {
	route: { params: { order: IGetOrderResponse } };
}

const BlocktankPayment = (props: Props): ReactElement => {
	const { order } = props.route.params;

	const navigation = useNavigation();

	const selectedWallet = useSelector(
		(store: Store) => store.wallet.selectedWallet,
	);
	const selectedNetwork = useSelector(
		(store: Store) => store.wallet.selectedNetwork,
	);
	const transaction = useTransactionDetails();
	const balance = useBalance();

	const { bitcoinFormatted, bitcoinSymbol, fiatFormatted, fiatSymbol } =
		useDisplayValues(balance);

	useEffect(() => {
		setupOnChainTransaction({
			selectedWallet,
			selectedNetwork,
		});

		updateOnChainTransaction({
			selectedWallet,
			selectedNetwork,
			transaction: {
				outputs: [{ address: order.btc_address, value: order.total_amount }],
				rbf: false, //Always needs to be false for zero conf payments to be accepted by blocktank
				satsPerByte: order.zero_conf_satvbyte || 1,
			},
		}).catch(() => {});

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	/**
	 * Returns the satsPerByte for the given transaction.
	 */
	const satsPerByte = useCallback((): number => {
		try {
			return transaction?.satsPerByte || 1;
		} catch (e) {
			return 1;
		}
	}, [transaction?.satsPerByte])();

	/**
	 * Adjusts the fee of the current on-chain transaction by a specified amount.
	 * @param {number} adjustBy
	 */
	const adjustFee = (adjustBy = 0): void => {
		const spb = satsPerByte || 0;
		updateFee({
			selectedNetwork,
			selectedWallet,
			satsPerByte: spb + adjustBy,
		});
	};

	const feeBelowRecommended = useCallback((): boolean => {
		if (order.zero_conf_satvbyte && transaction?.satsPerByte) {
			return transaction?.satsPerByte < order.zero_conf_satvbyte;
		}

		return false;
	}, [transaction?.satsPerByte, order.zero_conf_satvbyte]);

	const onCreateTransaction = async (): Promise<void> => {
		const totalFee = getTotalFee({
			selectedNetwork,
			selectedWallet,
			satsPerByte,
		});

		const transactionTotal = order.total_amount + totalFee;

		if (transactionTotal > balance) {
			return showErrorNotification({
				title: 'Insufficient balance',
				message: 'You cannot make this purchase',
			});
		}

		const res = await createTransaction({
			selectedNetwork,
			selectedWallet,
		});

		if (res.isErr()) {
			return showErrorNotification({
				title: 'Failed to create transaction',
				message: res.error.message,
			});
		}

		await onSend(res.value, transactionTotal);
	};

	const onSend = async (
		rawTx: string,
		transactionTotal: number,
	): Promise<void> => {
		const res = await broadcastTransaction({
			rawTx,
			selectedNetwork,
		});

		if (res.isErr()) {
			return showErrorNotification({
				title: 'Failed to broadcast transaction',
				message: res.error.message,
			});
		}

		showSuccessNotification({
			title: 'Invoice paid',
			message: '',
		});

		//Temporarily update the balance until the Electrum mempool catches up in a few seconds.
		updateWalletBalance({
			balance: balance - transactionTotal,
			selectedWallet,
			selectedNetwork,
		});

		await resetStore();
		onClose();
	};

	const resetStore = async (): Promise<void> => {
		await resetOnChainTransaction({
			selectedNetwork,
			selectedWallet,
		});
	};

	const onClose = (): void => {
		navigation.goBack();
	};

	const authCheck = (): void => {
		const { pin, biometrics } = hasEnabledAuthentication();
		if (pin || biometrics) {
			navigation.navigate('AuthCheck', {
				onSuccess: () => {
					// @ts-ignore
					navigation.pop();
					setTimeout(() => {
						onCreateTransaction().catch();
					}, 500);
				},
			});
		} else {
			onCreateTransaction().catch();
		}
	};

	LayoutAnimation.easeInEaseOut();

	return (
		<SafeAreaView style={styles.container}>
			<NavigationHeader title="Send Transaction" />

			<Text style={styles.availableBalance}>
				Available balance:{'\n'}
				{bitcoinSymbol}
				{bitcoinFormatted}
				{'\n'}
				{fiatSymbol}
				{fiatFormatted}
			</Text>

			<Text style={styles.feeHeading}>Fee:</Text>
			<AdjustValue
				value={satsPerByte}
				decreaseValue={(): void => adjustFee(-1)}
				increaseValue={(): void => adjustFee(1)}
			/>

			{feeBelowRecommended() ? (
				<Text style={styles.feeWarning}>
					Warning: lowering the fee below recommended minimum will result in
					your channel purchase being delayed
				</Text>
			) : null}

			<FeeSummary amount={order.total_amount} lightning />

			<Button color={'onSurface'} text="Pay" onPress={authCheck} />

			<Button
				color={'onSurface'}
				text="Cancel"
				onPress={async (): Promise<void> => {
					await resetStore();
					onClose();
				}}
			/>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingRight: 20,
		paddingLeft: 20,
		display: 'flex',
	},
	feeHeading: {
		marginTop: 20,
		textAlign: 'center',
	},
	feeWarning: {
		textAlign: 'center',
	},
	availableBalance: {
		marginTop: 20,
		marginBottom: 20,
		fontWeight: 'bold',
		fontSize: 16,
		textAlign: 'center',
	},
});

export default memo(BlocktankPayment);