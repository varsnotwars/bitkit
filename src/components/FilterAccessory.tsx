import React, { ReactElement, memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { KeyboardAccessoryView } from 'react-native-keyboard-accessory';

import Tag from './Tag';
import { Text13UP, View as ThemedView } from '../styles/components';
import Store from '../store/types';

const FilterAccessory = ({ tags, addTag }): ReactElement => {
	const suggestions = useSelector((store: Store) =>
		store.metadata.lastUsedTags.filter((t) => !tags.includes(t)),
	);

	if (suggestions.length === 0) {
		return <></>;
	}

	const content = (
		<ThemedView style={styles.suggestions} color="gray6">
			<Text13UP color="gray1">FILTER ACTIVITY USING TAGS</Text13UP>
			<View style={styles.suggestionsRow}>
				{suggestions.map((s) => (
					<Tag
						key={s}
						value={s}
						style={styles.tag}
						onPress={(): void => addTag(s)}
					/>
				))}
			</View>
		</ThemedView>
	);

	return (
		<KeyboardAccessoryView hideBorder androidAdjustResize avoidKeyboard>
			{content}
		</KeyboardAccessoryView>
	);
};

const styles = StyleSheet.create({
	suggestions: {
		paddingHorizontal: 16,
		paddingVertical: 16,
	},
	suggestionsRow: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		marginTop: 16,
		marginBottom: -8,
	},
	tag: {
		marginRight: 8,
		marginBottom: 8,
	},
});

export default memo(FilterAccessory);
