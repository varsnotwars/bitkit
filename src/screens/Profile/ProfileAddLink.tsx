import React, { useMemo, ReactElement, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import c from 'compact-encoding';

import { View as ThemedView, Text02S, Text02B } from '../../styles/components';
import Button from '../../components/Button';
import { useProfile, useSelectedSlashtag } from '../../hooks/slashtags';
import LabeledInput from '../../components/LabeledInput';
import { RootStackScreenProps } from '../../navigation/types';
import { BasicProfile } from '../../store/types/slashtags';
import Store from '../../store/types';
import { updateProfileLink } from '../../store/actions/ui';
import NavigationHeader from '../../components/NavigationHeader';
import SafeAreaInsets from '../../components/SafeAreaInsets';

export const ProfileAddLinkForm = ({
	navigation,
}: RootStackScreenProps<'ProfileAddLink'>): ReactElement => {
	const insets = useSafeAreaInsets();
	const form = useSelector((state: Store) => state.ui.profileLink);
	const { url, slashtag } = useSelectedSlashtag();
	const { profile } = useProfile(url);

	const saveProfile = useCallback(
		(data: BasicProfile) => {
			const publicDrive = slashtag?.drivestore.get();
			return publicDrive.put('/profile.json', c.encode(c.json, data));
		},
		[slashtag],
	);

	const buttonContainerStyles = useMemo(
		() => ({
			...styles.buttonContainer,
			paddingBottom: insets.bottom + 16,
		}),
		[insets.bottom],
	);

	const saveLink = (): void => {
		const prevLinks = profile?.links ?? [];
		saveProfile({
			...profile,
			links: [...prevLinks, { title: form.title, url: form.url }],
		});

		updateProfileLink({ title: '', url: '' });
		navigation.goBack();
	};

	const isValid = form.title?.length > 0 && form.url?.length > 0;

	return (
		<ThemedView style={styles.container}>
			<SafeAreaInsets type="top" />
			<NavigationHeader title="Add Link" />
			<View style={styles.content}>
				<LabeledInput
					style={styles.input}
					label="Label"
					placeholder="For example 'Website'"
					value={form.title}
					onChange={(value: string): void => {
						updateProfileLink({ ...form, title: value });
					}}>
					<TouchableOpacity
						onPress={(): void => {
							navigation.navigate('ProfileLinkSuggestions');
						}}>
						<Text02B color="brand">Suggestions</Text02B>
					</TouchableOpacity>
				</LabeledInput>
				<LabeledInput
					style={styles.input}
					label="Link or text"
					placeholder="https://"
					value={form.url}
					multiline={true}
					returnKeyType="default"
					onChange={(value: string): void => {
						updateProfileLink({ ...form, url: value });
					}}
				/>
				<Text02S style={styles.note} color="gray1">
					Note: Any link you add will be publicly visible.
				</Text02S>

				{isValid && (
					<View style={buttonContainerStyles}>
						<Button
							style={styles.button}
							text="Save"
							size="large"
							onPress={saveLink}
						/>
					</View>
				)}
			</View>
		</ThemedView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	content: {
		flex: 1,
		paddingHorizontal: 16,
	},
	input: {
		marginBottom: 16,
	},
	note: {
		marginTop: 32,
	},
	buttonContainer: {
		marginTop: 16,
		flexDirection: 'row',
		justifyContent: 'center',
	},
	button: {
		flex: 1,
	},
});

export default ProfileAddLinkForm;