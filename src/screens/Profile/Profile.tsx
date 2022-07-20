import React, { useState } from 'react';
import {
	CopyIcon,
	InfoIcon,
	PencileIcon,
	QrPage,
	ShareIcon,
	Text,
	UsersIcon,
	View,
} from '../../styles/components';
import NavigationHeader from '../../components/NavigationHeader';
import { StyleSheet, useWindowDimensions, Share } from 'react-native';
import Button from '../../components/Button';
import Store from '../../store/types';
import { useSelector } from 'react-redux';
import { useSlashtag } from '../../hooks/slashtags';
import SafeAreaInsets from '../../components/SafeAreaInsets';
import ProfileCard from '../../components/ProfileCard';
import {
	ProfileIntro,
	PaymentsFromContacts,
	OfflinePayments,
} from './ProfileOnboarding';
import QR from 'react-native-qrcode-svg';
import { BasicProfile } from '../../store/types/slashtags';
import { TouchableOpacity } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import ProfileLinks from '../../components/ProfileLinks';
import ProfileEdit from './ProfileEdit';

export const Profile = ({ navigation, route }): JSX.Element => {
	const onboardingProfileStep = useSelector(
		(store: Store) => store.slashtags.onboardingProfileStep,
	);

	switch (onboardingProfileStep) {
		case 'Intro':
			return <ProfileIntro navigation={navigation} />;
		case 'InitialEdit':
			return <ProfileEdit navigation={navigation} route={route} />;
		case 'PaymentsFromContacts':
			return <PaymentsFromContacts navigation={navigation} />;
		case 'OfflinePayments':
			return <OfflinePayments navigation={navigation} />;
		case 'Done':
			return <ProfileScreen navigation={navigation} route={route} />;
		default:
			return <ProfileScreen navigation={navigation} route={route} />;
	}
};

const ProfileScreen = ({ navigation, route }): JSX.Element => {
	const id = route.params?.id;
	const { slashtag, profile } = useSlashtag({ url: id });

	const [view, setView] = useState('qr');

	function switchView(): void {
		view === 'details' ? setView('qr') : setView('details');
	}

	return (
		<View style={styles.container}>
			<SafeAreaInsets type={'top'} />
			<NavigationHeader
				title="Profile"
				displayBackButton={false}
				onClosePress={(): void => {
					navigation.navigate('Tabs');
				}}
			/>
			<View style={styles.content}>
				<ProfileCard id={slashtag?.url.toString()} profile={profile} />
				<View style={styles.divider} />
				<View style={styles.bottom}>
					<View style={styles.bottomHeader}>
						<IconButton onPress={switchView}>
							{view === 'qr' ? (
								<InfoIcon height={24} width={24} color="brand" />
							) : (
								<QrPage height={24} width={24} color="brand" />
							)}
						</IconButton>
						<IconButton
							onPress={(): void => {
								slashtag?.url.toString() &&
									Clipboard.setString(slashtag?.url.toString());
							}}>
							<CopyIcon height={24} width={24} color="brand" />
						</IconButton>
						<IconButton
							onPress={(): void => {
								slashtag?.url &&
									Share.share({
										title: 'Share Slashtag url',
										message: slashtag?.url.toString(),
									});
							}}>
							<ShareIcon height={24} width={24} color="brand" />
						</IconButton>
						<IconButton
							onPress={(): void => {
								navigation.navigate('ProfileEdit', { id: id });
							}}>
							<PencileIcon height={24} width={24} color="brand" />
						</IconButton>
						<IconButton
							onPress={(): void => {
								navigation.navigate('Contacts');
							}}>
							<UsersIcon height={24} width={24} color="brand" />
						</IconButton>
					</View>
					{view === 'details' ? (
						<ProfileLinks links={profile.links} style={styles.profileDetails} />
					) : (
						<QRView profile={profile} />
					)}
				</View>

				<Button
					textStyle={styles.button}
					size="large"
					text={view === 'details' ? 'Show QR code' : 'Profile details'}
					onPress={switchView}
				/>
			</View>
		</View>
	);
};

const IconButton = ({
	children,
	onPress,
}: {
	children?: any;
	onPress?: () => void;
}): JSX.Element => {
	return (
		<TouchableOpacity
			activeOpacity={0.7}
			onPress={onPress}
			style={styles.iconContainer}>
			{children}
		</TouchableOpacity>
	);
};

const QRView = ({
	id,
	profile,
}: {
	id?: string;
	profile?: BasicProfile;
}): JSX.Element => {
	const { width } = useWindowDimensions();
	return (
		<View style={styles.qrViewContainer}>
			<View style={styles.qrContainer}>
				<QR
					value={id}
					size={(width * 2) / 3}
					logo={{ uri: profile?.image || '' }}
					logoBackgroundColor={profile?.image ? '#fff' : 'transparent'}
					logoSize={70}
					logoBorderRadius={999}
					logoMargin={10}
					quietZone={20}
				/>
			</View>
			<Text style={styles.qrViewNote}>Scan to add {profile?.name}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	content: {
		flex: 1,
		justifyContent: 'space-between',
		margin: 20,
		marginTop: 0,
		backgroundColor: 'transparent',
	},
	divider: {
		height: 2,
		backgroundColor: 'rgba(255, 255, 255, 0.1)',

		marginTop: 16,
		marginBottom: 16,
	},
	bottom: {
		flex: 1,
		display: 'flex',
		flexDirection: 'column',
	},
	button: {
		fontWeight: '800',
	},
	iconContainer: {
		width: 48,
		height: 48,
		borderRadius: 9999,
		backgroundColor: 'rgba(255, 255, 255, 0.08)',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 16,
	},
	bottomHeader: {
		display: 'flex',
		flexDirection: 'row',
	},
	qrViewContainer: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		flex: 1,
	},
	qrContainer: {
		borderRadius: 10,
		overflow: 'hidden',
	},
	qrViewNote: {
		marginTop: 16,
		fontSize: 15,
		lineHeight: 20,
	},
	profileDetails: {
		marginTop: 32,
	},
});

export default Profile;
