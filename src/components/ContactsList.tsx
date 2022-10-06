import React, { ReactElement, useCallback, useMemo } from 'react';
import { View, SectionList, StyleSheet, TouchableOpacity } from 'react-native';

import { Caption13Up, Text01M, View as ThemedView } from '../styles/components';
import ProfileImage from './ProfileImage';
import { SlashtagURL } from './SlashtagURL';
import { useProfile, useSelectedSlashtag } from '../hooks/slashtags';
import { IContactRecord } from '../store/types/slashtags';
import { useSlashtags } from './SlashtagsProvider';
import Divider from './Divider';

export const ContactItem = ({
	contact,
	onPress,
	size,
}: {
	contact: IContactRecord;
	onPress?: (contact: IContactRecord) => void;
	size?: 'small' | 'normal';
}): JSX.Element => {
	const { url: myProfileURL } = useSelectedSlashtag();
	const { profile } = useProfile(contact.url);

	const name = useMemo(() => {
		const fallbackName =
			contact.url === myProfileURL ? 'Your Name' : 'Contact Name';
		return profile?.name || contact?.name || fallbackName;
	}, [contact?.name, profile?.name]);

	return (
		<TouchableOpacity
			activeOpacity={0.8}
			onPress={(): void => {
				onPress?.(contact);
			}}>
			<Divider />
			<View style={cstyles.container}>
				<ProfileImage
					url={contact.url}
					image={profile?.image}
					size={size === 'small' ? 32 : 48}
				/>
				<View style={cstyles.column}>
					<Text01M style={size !== 'small' ? cstyles.name : {}}>{name}</Text01M>
					<SlashtagURL
						color="gray"
						url={contact.url}
						onPress={(): void => {
							onPress?.(contact);
						}}
					/>
				</View>
			</View>
		</TouchableOpacity>
	);
};

const Empty = (): ReactElement => (
	<View style={estyles.empty}>
		<Text01M>No Contacts found</Text01M>
	</View>
);

const ContactsList = ({
	onPress,
	searchFilter = '',
	includeMyProfile = false,
	sectionBackgroundColor = 'black',
	stickySectionHeadersEnabled,
}: {
	onPress: (contact: IContactRecord) => void;
	searchFilter?: string;
	includeMyProfile?: boolean;
	sectionBackgroundColor?: string;
	stickySectionHeadersEnabled?: boolean;
}): ReactElement => {
	const contacts = useSlashtags().contacts;
	const { url: myProfileURL } = useSelectedSlashtag();

	const filteredContacts = useMemo(() => {
		return Object.values(contacts)
			.sort((a, b) => (a.name > b.name ? 1 : -1))
			.filter(
				({ name }) =>
					searchFilter.length === 0 ||
					name?.toLowerCase().includes(searchFilter?.toLowerCase()),
			);
	}, [contacts, searchFilter]);

	const sectionedContacts = useMemo(() => {
		const sections: { [char: string]: IContactRecord[] } = {};

		filteredContacts.forEach((contact) => {
			const name = contact?.name ?? 'Contact Name';
			const char = name.slice(0, 1);
			if (char) {
				sections[char]
					? sections[char].push(contact)
					: (sections[char] = [contact]);
			}
		});

		const result = Object.entries(sections).map(([title, data]) => ({
			title,
			data,
		}));

		if (includeMyProfile && searchFilter.length === 0) {
			result.unshift({
				title: 'My profile',
				data: [{ url: myProfileURL as string } as IContactRecord],
			});
		}

		return result;
	}, [filteredContacts, myProfileURL, includeMyProfile, searchFilter]);

	return (
		<SectionList
			sections={sectionedContacts as any}
			keyExtractor={(item: IContactRecord): string => item.url}
			ListEmptyComponent={Empty}
			renderSectionHeader={useCallback(
				({ section: { title } }): ReactElement => {
					const isFirst = title === sectionedContacts[0].title;
					return (
						<ThemedView
							color={sectionBackgroundColor}
							style={[styles.sectionHeader, !isFirst ? { marginTop: 40 } : {}]}>
							<Caption13Up color="gray1">{title}</Caption13Up>
						</ThemedView>
					);
				},
				[],
			)}
			renderItem={({ item: contact }): ReactElement => (
				<ContactItem contact={contact} onPress={onPress} />
			)}
			stickySectionHeadersEnabled={stickySectionHeadersEnabled}
		/>
	);
};

const cstyles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 10,
		marginBottom: 10,
	},
	column: {
		marginLeft: 16,
	},
	name: {
		marginBottom: 4,
	},
});

const estyles = StyleSheet.create({
	empty: {
		alignSelf: 'center',
		marginTop: '50%',
	},
});

const styles = StyleSheet.create({
	sectionHeader: {
		height: 24,
	},
});

export default ContactsList;
