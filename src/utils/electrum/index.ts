import { TAvailableNetworks } from '../networks';
import { getSelectedNetwork } from '../wallet';
import * as electrum from 'rn-electrum-client/helpers';
const hardcodedPeers = require('rn-electrum-client/helpers/peers.json');
import { err, ok, Result } from '@synonymdev/result';
import { connectToElectrum } from '../wallet/electrum';

export const defaultElectrumPorts = ['51002', '50002', '51001', '50001'];

/**
 * Returns the default port for the given network and protocol.
 * @param {TAvailableNetworks} [selectedNetwork]
 * @param {string} [protocol]
 */
export const getDefaultPort = (
	selectedNetwork: TAvailableNetworks = 'bitcoin',
	protocol = 'ssl',
): string => {
	if (protocol === 'ssl') {
		try {
			return selectedNetwork.toLowerCase().includes('testnet')
				? '51002'
				: '50002';
		} catch (e) {
			return '50002';
		}
	} else {
		try {
			return selectedNetwork.toLowerCase().includes('testnet')
				? '51001'
				: '50001';
		} catch (e) {
			return '50001';
		}
	}
};

export interface IFormattedPeerData {
	ip?: string;
	host: string;
	version?: string;
	ssl: string | number;
	tcp: string | number;
}

/**
 * Formats the peer data response from an Electrum server.
 * @param {[string, string, [string, string, string]]} data
 * @return Result<IFormattedPeerData>
 */
export const formatPeerData = (
	data: [string, string, [string, string, string]],
): Result<IFormattedPeerData> => {
	try {
		if (!data) {
			return err('No data provided.');
		}
		if (data?.length !== 3) {
			return err('Invalid peer data');
		}
		if (data[2]?.length < 2) {
			return err('Invalid peer data');
		}
		const [ip, host, ports] = data;
		const [version, ssl, tcp] = ports;
		return ok({
			ip,
			host,
			version,
			ssl,
			tcp,
		});
	} catch (e) {
		return err(e);
	}
};

/**
 * Returns an array of peers.
 * If unable to acquire peers from an Electrum server the method will default to the hardcoded peers in peers.json.
 * @param {TAvailableNetworks} [selectedNetwork]
 * @return Promise<Result<IFormattedPeerData[]>>
 */
export const getPeers = async ({
	selectedNetwork,
}: {
	selectedNetwork: TAvailableNetworks;
}): Promise<Result<IFormattedPeerData[]>> => {
	try {
		if (!selectedNetwork) {
			selectedNetwork = getSelectedNetwork();
		}
		const response = await electrum.getPeers({ network: selectedNetwork });
		if (!response.error) {
			// Return an array of peers provided by the currently connected electrum server.
			let peers: IFormattedPeerData[] = [];
			await Promise.all(
				response.data.map(async (peer) => {
					const formattedPeer = await formatPeerData(peer);
					if (formattedPeer.isOk()) {
						peers.push(formattedPeer.value);
					}
				}),
			);
			if (peers?.length > 0) {
				return ok(peers);
			}
		}
		// No peers available grab hardcoded peers instead.
		return ok(hardcodedPeers[selectedNetwork]);
	} catch (e) {
		console.log(e);
		return err(e);
	}
};

const POLLING_INTERVAL = 1000 * 10;

type ElectrumConnectionPubSub = {
	publish: (isConnected: boolean) => void;
	subscribe: (callback: (isConnected: boolean) => void) => () => void;
};

/**
 * PubSub for Electrum server connection
 * If connection was lost this will try to reconnect in the specified interval
 */
export const electrumConnection = ((): ElectrumConnectionPubSub => {
	let subscribers: Array<(isConnected: boolean) => void> = [];
	let latestState: boolean | null = null;

	function publish(isConnected: boolean): void {
		// Skip if no subscribers
		if (!Array.isArray(subscribers)) {
			return;
		}

		// Skip the first check
		if (latestState === null) {
			latestState = isConnected;
			return;
		}

		// Skip if state hasn't changed
		if (isConnected === latestState) {
			return;
		}

		latestState = isConnected;
		subscribers.forEach((callback) => callback(isConnected));
	}

	function subscribe(callback: (isConnected: boolean) => void): () => void {
		// Create the subscribers array if not initialized yet
		if (!Array.isArray(subscribers)) {
			subscribers = [];
		}
		subscribers.push(callback);

		const timerId = setInterval(async () => {
			// Check the connection
			const { error } = await electrum.pingServer();
			electrumConnection.publish(!error);

			// Try to reconnect
			if (error) {
				connectToElectrum({});
			}
		}, POLLING_INTERVAL);

		// unsubscribe
		return () => {
			clearInterval(timerId);
			subscribers = subscribers.filter((cb) => !(cb === callback));
		};
	}

	return {
		publish,
		subscribe,
	};
})();
