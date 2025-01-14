import { SDK, SlashURL, Slashtag, Hyperdrive } from '@synonymdev/slashtags-sdk';
import c from 'compact-encoding';
import b4a from 'b4a';
import mime from 'mime/lite';
import debounce from 'lodash.debounce';

import { navigate } from '../../navigation/root/RootNavigator';
import { BasicProfile, SlashPayConfig } from '../../store/types/slashtags';
import { showErrorNotification } from '../notifications';
import { getReceiveAddress, getSelectedAddressType } from '../../utils/wallet';
import { decodeLightningInvoice } from '../../utils/lightning';
import { createLightningInvoice } from '../../store/actions/lightning';
import { getStore } from '../../store/helpers';

/**
 * Handles pasting or scanning a slash:// url
 */
export const handleSlashtagURL = (
	url: string,
	onError?: (error: Error) => void,
	onSuccess?: (url: string) => void,
): void => {
	try {
		// Validate URL
		const parsed = SlashURL.parse(url);

		if (parsed.protocol === 'slash:') {
			navigate('ContactEdit', { url });
		} else if (parsed.protocol === 'slashfeed:') {
			navigate('WidgetFeedEdit', { url });
		}

		onSuccess && onSuccess(url);
	} catch (error) {
		onError && onError(error as Error);
	}
};

/**
 * Returns the selected Slashtag.
 * Currently we don't support multiple personas so it returns the root(default) slashtag.
 */
export const getSelectedSlashtag = (sdk: SDK): Slashtag => {
	return sdk.slashtag();
};

/**
 * Saves a contact record in the contacts drive, and cache it in the store.
 */
// TODO(slashtags): should we add this to salshtag.setContact() ?
export const saveContact = async (
	slashtag: Slashtag,
	url: string,
	record: BasicProfile,
): Promise<void> => {
	if (checkClosed(slashtag)) {
		return;
	}

	const drive = await slashtag.drivestore.get('contacts');
	const id = SlashURL.parse(url).id;
	await drive?.put('/' + id, encodeJSON(record)).catch((error: Error) =>
		showErrorNotification({
			title: 'Error while saving contact: ',
			message: error.message,
		}),
	);
	closeDriveSession(drive);
};

export const saveProfile = async (
	slashtag: Slashtag,
	profile: BasicProfile,
): Promise<void> => {
	if (checkClosed(slashtag)) {
		return;
	}

	const drive = slashtag?.drivestore.get();
	await drive.put('/profile.json', encodeJSON(profile)).catch((error: Error) =>
		showErrorNotification({
			title: 'Error while saving profile: ',
			message: error.message,
		}),
	);

	closeDriveSession(drive);
};

/**
 * Deletes a contact from the 'contacts' SlashDrive
 */
// TODO(slashtags): should we add a slashtag.deleteContact()?
export const deleteContact = async (
	slashtag: Slashtag,
	url: string,
): Promise<void> => {
	if (checkClosed(slashtag)) {
		return;
	}

	const drive = await slashtag.drivestore.get('contacts');
	const id = SlashURL.parse(url).id;
	await drive.del('/' + id).catch((error: Error) =>
		showErrorNotification({
			title: 'Error while deleting contact: ',
			message: error.message,
		}),
	);

	closeDriveSession(drive);
};

/**
 * A helper function for saving many contacts at once for debugging purposes.
 * Generate a list using stpg's createBulkContacts and replace the urls array below.
 */
export const saveBulkContacts = async (slashtag: Slashtag): Promise<void> => {
	if (checkClosed(slashtag)) {
		return;
	}

	// Keep it empty on commit
	const urls: Array<string> = [];
	console.debug('Saving bulk contacts', { count: urls.length });

	const drive = await slashtag.drivestore.get('contacts');
	const batch = drive.batch();

	await Promise.all(
		urls.map(async (url) => {
			const name = Math.random().toString(16).slice(2, 8);
			const id = SlashURL.parse(url).id;
			return batch?.put('/' + id, encodeJSON({ name }));
		}),
	);
	await batch.flush();
	console.debug('Done saving bulk contacts');
	closeDriveSession(drive);
};

export const onSDKError = (error: Error): void => {
	// TODO (slashtags) move this error management to the SDK
	if (error.message.endsWith('Connection refused')) {
		error = new Error("Couldn't connect to the provided DHT relay");
	}

	showErrorNotification({
		title: 'SlashtagsProvider Error',
		message: error.message,
	});
};

export const updateSlashPayConfig = debounce(
	async (sdk?: SDK): Promise<void> => {
		if (!sdk) {
			// sdk is not ready yet
			return;
		}
		const slashtag = getSelectedSlashtag(sdk);
		const drive = slashtag.drivestore.get();
		const payConfig =
			(await drive.get('/slashpay.json').then(decodeJSON).catch(noop)) || [];

		const store = getStore();
		const { selectedWallet, selectedNetwork } = store.wallet;
		const { enableOfflinePayments } = store.settings;
		const addressType = getSelectedAddressType({
			selectedWallet,
			selectedNetwork,
		});
		const invoices =
			store.lightning.nodes[selectedWallet].invoices[selectedNetwork];

		// if offline payments are disabled and payment config is empy then do nothing
		if (!enableOfflinePayments && payConfig.length === 0) {
			return;
		}

		// if offline payments are disabled and payment config is not empy then delete it
		if (!enableOfflinePayments && payConfig.length > 0) {
			const newPayConfig = [];
			console.debug('Pushing new slashpay.json:', newPayConfig);
			await drive
				.put('/slashpay.json', encodeJSON(newPayConfig))
				.then(() => {
					console.debug('Updated slashpay.json:', newPayConfig);
				})
				.catch(noop);
			return;
		}

		let needToUpdate = false;
		const newPayConfig: SlashPayConfig = [];

		// check if we need to update onchain address
		{
			const currentAddress = payConfig.find(
				({ type }) => type === addressType,
			)?.value;
			const newAddress = getReceiveAddress({ selectedWallet });
			if (newAddress.isOk() && currentAddress !== newAddress.value) {
				// use new address
				needToUpdate = true;
				newPayConfig.push({ type: addressType, value: newAddress.value });
			} else if (currentAddress) {
				// keep old address
				newPayConfig.push({ type: addressType, value: currentAddress });
			}
		}

		// check if we need to update LN invoice
		{
			const currentInvoice = payConfig.find(
				({ type }) => type === 'lightningInvoice',
			)?.value;

			// if currentInvoice still in redux store, then we don't need to update it.
			const currentInvoiceStillUnpaid =
				currentInvoice &&
				Object.values(invoices || {}).some((i) => i?.to_str === currentInvoice);

			const decodedInvoice = await decodeLightningInvoice({
				paymentRequest: currentInvoice,
			});
			const invoiceNeedsToBeUpdated =
				!currentInvoice ||
				!currentInvoiceStillUnpaid ||
				decodedInvoice.isErr() ||
				decodedInvoice.value.is_expired;

			if (invoiceNeedsToBeUpdated) {
				needToUpdate = true;
				const response = await createLightningInvoice({
					amountSats: 0,
					description: '',
					expiryDeltaSeconds: 60 * 60 * 24 * 7, // one week
				});

				if (response.isOk()) {
					newPayConfig.push({
						type: 'lightningInvoice',
						value: response.value.to_str,
					});
				} else if (currentInvoice) {
					// if we can't get new invoice, keep an old one
					newPayConfig.push({
						type: 'lightningInvoice',
						value: currentInvoice,
					});
				}
			} else {
				// keeping old invoice
				newPayConfig.push({
					type: 'lightningInvoice',
					value: currentInvoice,
				});
			}
		}

		if (!needToUpdate) {
			closeDriveSession(drive);
			return;
		}

		console.debug('Pushing new slashpay.json:', newPayConfig);

		await drive
			.put('/slashpay.json', encodeJSON(newPayConfig))
			.then(() => {
				console.debug('Updated slashpay.json:', newPayConfig);
			})
			.catch(noop);

		closeDriveSession(drive);
	},
	5000,
);

/** Send hypercorse to seeder */
export const seedDrives = async (slashtag: Slashtag): Promise<boolean> => {
	// TODO (slashtags) https://github.com/synonymdev/slashtags/issues/56
	let drives: Hyperdrive[] = [];
	drives.push(slashtag.drivestore.get());
	drives.push(slashtag.drivestore.get('contacts'));

	// TODO (slashtags) move this logic (getting keys to be seeded) to the SDK
	return Promise.all(
		drives.map(async (drive: Hyperdrive) => {
			await drive.ready();
			await drive.getBlobs();
			const keys = [
				b4a.toString(drive.key, 'hex'),
				b4a.toString(drive.blobs.core.key, 'hex'),
			];

			const firstResponse = await fetch(
				'https://blocktank.synonym.to/seeding/hypercore',
				{
					method: 'POST',
					body: JSON.stringify({ publicKey: keys[0] }),
					headers: { 'Content-Type': 'application/json' },
				},
			);

			const secondResponse = await fetch(
				'https://blocktank.synonym.to/seeding/hypercore',
				{
					method: 'POST',
					body: JSON.stringify({ publicKey: keys[1] }),
					headers: { 'Content-Type': 'application/json' },
				},
			);

			closeDriveSession(drive);
			return [firstResponse.status, secondResponse.status].every(
				(s) => s === 200,
			);
		}),
	)
		.then((results) => results.every(Boolean))
		.catch((error) => {
			console.debug('Error in seeding drives request', {
				error: error.message,
			});
			return false;
		});
};

/** Get the slashpay.json of remote contact */
export const getSlashPayConfig = async (
	sdk: SDK,
	url: string,
): Promise<SlashPayConfig> => {
	if (sdk.closed) {
		console.debug('getSlashPayConfig: SKIP sdk is closed');
		return [];
	}

	const drive = sdk.drive(SlashURL.parse(url).key);
	await drive.ready().catch(noop);
	const payConfig =
		(await drive.get('/slashpay.json').then(decodeJSON).catch(noop)) || [];

	closeDriveSession(drive);
	return payConfig;
};

/**
 * unlike drive.close() this function will only gc session but not close the first hypercore
 * avoids errors trying to create a session from a closed hypercore
 * TODO (slashtags) investigate how to handle this at the SDK level instead
 * try to replicate it in a failing test and figure out sensible defaults.
 **/
export const closeDriveSession = (drive: Hyperdrive): void => {
	drive
		.ready()
		.then(async () => {
			const core = drive.core;

			core.autoClose = false;
			await core.close();

			const blobsCore = drive.blobs?.core;
			if (blobsCore) {
				blobsCore.autoClose = false;
				await blobsCore.close();
			}

			// Uncomment next line to debug if you got an error: Cannot make sessions on a closing core
			// console.debug("Remaining sessions", drive.core.sessions.length, drive.blobs.core.sessions.length)
		})
		.catch(noop);
};

function noop(): void {}

function checkClosed(slashtag: Slashtag): boolean {
	if (slashtag.drivestore.closed) {
		showErrorNotification({
			title: 'SDK is closed',
			message: 'please restart Bitkit!',
		});
		return true;
	} else {
		return false;
	}
}

export const validateSlashtagURL = (url: string): boolean => {
	try {
		const parsed = SlashURL.parse(url);
		if (parsed.protocol === 'slash:') {
			return true;
		}
		return false;
	} catch (error) {
		return false;
	}
};

/**
 * Decode JSON from Uint8Array files from Hyperdrives
 */
export function decodeJSON(buf: Uint8Array | null): object | undefined {
	if (!buf || buf.byteLength === 0) {
		return;
	}
	try {
		return JSON.parse(b4a.toString(buf));
	} catch (error) {
		// Backword compatible
		// TODO(slashtags): remove before launch?
		return c.decode(c.json, buf);
	}
}

/**
 * Encode JSON as Uint8Array for hyperdrive json files
 */
export function encodeJSON(json: object): Uint8Array {
	return b4a.from(JSON.stringify(json));
}

/**
 * Open an image from Hyperdrive and convert it to base64 data URL
 */
export const readAsDataURL = async (
	drive: Hyperdrive,
	path: string,
): Promise<string> => {
	const base64 = await drive
		.get(path)
		.then((buf: Uint8Array) => buf && b4a.toString(buf, 'base64'));

	const mimeType = mime.getType(path);

	return base64 && `data:${mimeType};base64,${base64}`;
};
