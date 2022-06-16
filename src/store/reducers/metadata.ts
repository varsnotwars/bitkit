import actions from '../actions/actions';
import { IMetadata } from '../types/metadata';
import { defaultMetadataShape } from '../shapes/metadata';

const updateLastUsedTags = (
	oldTags: Array<string>,
	newTags: Array<string>,
): Array<string> => {
	let tags = [...newTags, ...oldTags];
	tags = [...new Set(tags)];
	tags = tags.slice(0, 10);
	return tags;
};

const metadata = (
	state: IMetadata = { ...defaultMetadataShape },
	action,
): IMetadata => {
	switch (action.type) {
		case actions.UPDATE_META_TX_TAGS: {
			const tags = state.tags;

			if (action.payload.tags.length === 0) {
				delete tags[action.payload.txid];
			} else {
				tags[action.payload.txid] = action.payload.tags;
			}

			const lastUsedTags = updateLastUsedTags(
				state.lastUsedTags,
				action.payload.tags,
			);

			return {
				...state,
				tags: { ...tags },
				lastUsedTags,
			};
		}

		case actions.ADD_META_TX_TAG: {
			let txTags = state.tags[action.payload.txid] ?? [];
			txTags = [...txTags, action.payload.tag];
			txTags = [...new Set(txTags)]; // remove duplicates

			const lastUsedTags = updateLastUsedTags(state.lastUsedTags, [
				action.payload.tag,
			]);

			return {
				...state,
				tags: {
					...state.tags,
					[action.payload.txid]: txTags,
				},
				lastUsedTags,
			};
		}

		case actions.DELETE_META_TX_TAG: {
			const tags = state.tags;
			let txTags = tags[action.payload.txid] ?? [];
			txTags = txTags.filter((t) => t !== action.payload.tag);

			if (txTags.length === 0) {
				delete tags[action.payload.txid];
			} else {
				tags[action.payload.txid] = txTags;
			}

			return {
				...state,
				tags: { ...tags },
			};
		}

		default:
			return state;
	}
};

export default metadata;
