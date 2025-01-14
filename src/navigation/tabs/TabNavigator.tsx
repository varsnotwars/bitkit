import React, { ReactElement, useCallback, useMemo, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {
	BottomTabBarProps,
	createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {
	createNativeStackNavigator,
	NativeStackNavigationOptions,
	NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { SvgXml } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import WalletsScreen from '../../screens/Wallets';
import WalletsDetail from '../../screens/Wallets/WalletsDetail';
import BackupPrompt from '../../screens/Settings/Backup/BackupPrompt';
import HighBalanceWarning from '../bottom-sheet/HighBalanceWarning';
import { ScanIcon, Text02M } from '../../styles/components';
import AuthCheck from '../../components/AuthCheck';
import BlurView from '../../components/BlurView';
import { receiveIcon, sendIcon } from '../../assets/icons/tabs';
import { toggleView } from '../../store/actions/user';
import useColors from '../../hooks/colors';
import { TAssetType } from '../../store/types/wallet';

export type TabNavigationProp = NativeStackNavigationProp<TabStackParamList>;

export type TabStackParamList = {
	Wallets: undefined;
	WalletsDetail: {
		assetType: TAssetType;
	};
	AuthCheck: { onSuccess: () => void };
};

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<TabStackParamList>();

const navOptions: NativeStackNavigationOptions = {
	headerShown: false,
};

const screenOptions = {
	...navOptions,
};

const modalOptions = {
	...navOptions,
};

const WalletsStack = (): ReactElement => {
	return (
		<Stack.Navigator initialRouteName="Wallets" screenOptions={navOptions}>
			<Stack.Screen
				name="Wallets"
				component={WalletsScreen}
				options={screenOptions}
			/>
			<Stack.Screen name="WalletsDetail" component={WalletsDetail} />
			<Stack.Group screenOptions={modalOptions}>
				<Stack.Screen name="AuthCheck" component={AuthCheck} />
			</Stack.Group>
		</Stack.Navigator>
	);
};

export const TabBar = ({
	navigation,
	state,
}: BottomTabBarProps): ReactElement => {
	const { white08 } = useColors();
	const insets = useSafeAreaInsets();
	const [isFocused, setIsFocused] = useState(false);

	useFocusEffect(() => {
		setIsFocused(true);

		return (): void => {
			setIsFocused(false);
		};
	});

	const screen = useMemo(() => {
		const wsState = state.routes.find((r) => r.name === 'WalletsStack')?.state;

		// wsState is undefined on Wallets screen on initial render
		if (!wsState?.index) {
			return 'Wallets';
		}

		return wsState.routes[wsState.index].name;
	}, [state]);

	const onReceivePress = useCallback((): void => {
		toggleView({
			view: 'receiveNavigation',
			data: { isOpen: true },
		});
	}, []);

	const onSendPress = useCallback((): void => {
		toggleView({
			view: 'sendNavigation',
			data: { isOpen: true },
		});
	}, []);

	const openScanner = useCallback(
		() => navigation.navigate('Scanner'),
		[navigation],
	);

	const isWalletScreenFocused = isFocused && screen === 'Wallets';

	const androidStyles = {
		borderColor: white08,
		borderTopColor: '#272727',
		borderBottomColor: '#272727',
	};

	const iosStyles = {
		borderColor: white08,
	};

	const borderStyles = Platform.OS === 'android' ? androidStyles : iosStyles;

	return (
		<>
			<View style={[styles.tabRoot, { bottom: Math.max(insets.bottom, 16) }]}>
				<TouchableOpacity onPress={onSendPress} style={styles.blurContainer}>
					<BlurView style={styles.send}>
						<SvgXml xml={sendIcon('white')} width={13} height={13} />
						<Text02M style={styles.tabText}>Send</Text02M>
					</BlurView>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={openScanner}
					activeOpacity={0.8}
					style={[styles.tabScan, borderStyles]}>
					<ScanIcon width={32} height={32} />
				</TouchableOpacity>
				<TouchableOpacity onPress={onReceivePress} style={styles.blurContainer}>
					<BlurView style={styles.receive}>
						<SvgXml xml={receiveIcon('white')} width={13} height={13} />
						<Text02M style={styles.tabText}>Receive</Text02M>
					</BlurView>
				</TouchableOpacity>
			</View>

			{isWalletScreenFocused && (
				<>
					<BackupPrompt />
					<HighBalanceWarning />
				</>
			)}
		</>
	);
};

const TabNavigator = (): ReactElement => {
	const tabScreenOptions = useMemo(
		() => ({
			tabBarHideOnKeyboard: true,
			headerShown: false,
		}),
		[],
	);

	const tabBar = useCallback((props) => {
		return <TabBar {...props} />;
	}, []);

	return (
		<Tab.Navigator tabBar={tabBar}>
			<Tab.Group screenOptions={tabScreenOptions}>
				<Tab.Screen name="WalletsStack" component={WalletsStack} />
			</Tab.Group>
		</Tab.Navigator>
	);
};

const styles = StyleSheet.create({
	tabRoot: {
		position: 'absolute',
		left: 16,
		right: 16,
		height: 80,
		flexDirection: 'row',
		alignItems: 'center',
		zIndex: 0,
	},
	blurContainer: {
		height: 56,
		flex: 1,
	},
	send: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
		paddingRight: 30,
		borderRadius: 30,
	},
	receive: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
		paddingLeft: 30,
		borderRadius: 30,
	},
	tabScan: {
		height: 80,
		width: 80,
		backgroundColor: '#101010',
		borderRadius: 40,
		borderWidth: 2,
		marginHorizontal: -40,
		alignItems: 'center',
		justifyContent: 'center',
		zIndex: 1,
	},
	tabText: {
		marginLeft: 6,
	},
});

export default TabNavigator;
