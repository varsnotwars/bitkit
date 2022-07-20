const actions = {
	UPDATE_USER: 'UPDATE_USER',
	TOGGLE_VIEW: 'TOGGLE_VIEW',
	RESET_USER_STORE: 'RESET_USER_STORE',
	USER_IGNORE_BACKUP: 'USER_IGNORE_BACKUP',
	USER_VERIFY_BACKUP: 'USER_VERIFY_BACKUP',
	UPDATE_WALLET: 'UPDATE_WALLET',
	UPDATE_HEADER: 'UPDATE_HEADER',
	UPDATE_WALLET_BALANCE: 'UPDATE_WALLET_BALANCE',
	CREATE_WALLET: 'CREATE_WALLET',
	RESET_WALLET_STORE: 'RESET_WALLET_STORE',
	RESET_SELECTED_WALLET: 'RESET_SELECTED_WALLET',
	RESET_OUTPUTS: 'RESET_OUTPUTS',
	SETUP_ON_CHAIN_TRANSACTION: 'SETUP_ON_CHAIN_TRANSACTION',
	UPDATE_ON_CHAIN_TRANSACTION: 'UPDATE_ON_CHAIN_TRANSACTION',
	RESET_ON_CHAIN_TRANSACTION: 'RESET_ON_CHAIN_TRANSACTION',
	DELETE_ON_CHAIN_TRANSACTION: 'DELETE_ON_CHAIN_TRANSACTION',
	ADD_BOOSTED_TRANSACTION: 'ADD_BOOSTED_TRANSACTION',
	DELETE_BOOSTED_TRANSACTION: 'DELETE_BOOSTED_TRANSACTION',
	UPDATE_ADDRESS_INDEX: 'UPDATE_ADDRESS_INDEX',
	UPDATE_SELECTED_ADDRESS_TYPE: 'UPDATE_SELECTED_ADDRESS_TYPE',
	ADD_ADDRESSES: 'ADD_ADDRESSES',
	UPDATE_UTXOS: 'UPDATE_UTXOS',
	UPDATE_TRANSACTIONS: 'UPDATE_TRANSACTIONS',
	UPDATE_SETTINGS: 'UPDATE_SETTINGS',
	UPDATE_ELECTRUM_PEERS: 'UPDATE_ELECTRUM_PEERS',
	RESET_SETTINGS_STORE: 'RESET_SETTINGS_STORE',
	CREATE_LIGHTNING_WALLET: 'CREATE_LIGHTNING_WALLET',
	UPDATE_LIGHTNING_STATE: 'UPDATE_LIGHTNING_STATE',
	RESET_LIGHTNING_STORE: 'RESET_LIGHTNING_STORE',
	UPDATE_LIGHTNING_INFO: 'UPDATE_LIGHTNING_INFO',
	UPDATE_ACTIVITY_ENTRIES: 'UPDATE_ACTIVITY_ENTRIES',
	UPDATE_ACTIVITY_SEARCH_FILTER: 'UPDATE_ACTIVITY_SEARCH_FILTER',
	UPDATE_ACTIVITY_TYPES_FILTER: 'UPDATE_ACTIVITY_TYPES_FILTER',
	REPLACE_ACTIVITY_ITEM: 'REPLACE_ACTIVITY_ITEM',
	RESET_ACTIVITY_STORE: 'RESET_ACTIVITY_STORE',
	RESET_ACTIVITY_FILTERS_STORE: 'RESET_ACTIVITY_FILTERS_STORE',
	BACKUP_UPDATE: 'BACKUP_UPDATE',
	RESET_BACKUP_STORE: 'RESET_BACKUP_STORE',
	WIPE_WALLET: 'WIPE_WALLET',
	UPDATE_BLOCKTANK_SERVICE_LIST: 'UPDATE_BLOCKTANK_SERVICE_LIST',
	UPDATE_BLOCKTANK_ORDER: 'UPDATE_BLOCKTANK_ORDER',
	RESET_BLOCKTANK_STORE: 'RESET_BLOCKTANK_STORE',
	ADD_TODO: 'ADD_TODO',
	REMOVE_TODO: 'REMOVE_TODO',
	DISMISS_TODO: 'DISMISS_TODO',
	UPDATE_FEES: 'UPDATE_FEES',
	UPDATE_ONCHAIN_FEE_ESTIMATES: 'UPDATE_ONCHAIN_FEE_ESTIMATES',
	UPDATE_META_TX_TAGS: 'UPDATE_META_TX_TAGS',
	ADD_META_TX_TAG: 'ADD_META_TX_TAG',
	DELETE_META_TX_TAG: 'DELETE_META_TX_TAG',
	RESET_SLASHTAGS_STORE: 'RESET_SLASHTAGS_STORE',
	SET_ONBOARDING_PROFILE_STEP: 'SET_ONBOARDING_PROFILE_STEP',
};
export default actions;
