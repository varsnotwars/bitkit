import { Platform, Switch as _Switch } from 'react-native';
import styled from 'styled-components';
import _Feather from 'react-native-vector-icons/Feather';
import _EvilIcon from 'react-native-vector-icons/EvilIcons';
import _Ionicons from 'react-native-vector-icons/Ionicons';
import _MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import _AntDesign from 'react-native-vector-icons/AntDesign';
import Animated from 'react-native-reanimated';
import colors from './colors';
import _RadioButtonRN from 'radio-buttons-react-native';
import { SvgXml } from 'react-native-svg';
import {
	DefaultTheme,
	NavigationContainer as _NavigationContainer,
} from '@react-navigation/native';
import { sanFranciscoWeights } from 'react-native-typography';
import { SafeAreaProvider as _SafeAreaProvider } from 'react-native-safe-area-context';

import {
	camera,
	settings,
	dismiss,
	boost,
	profileIcon,
} from '../assets/icons/header';
import {
	bitcoinIcon,
	lightningIcon,
	bitcoinCircleIcon,
	tetherCircleIcon,
	receivedIcon,
	sentIcon,
	transferIcon,
	coinsIcon,
	userPlusIcon,
	gitBranchIcon,
	noteIcon,
	checkCircleIcon,
	clockIcon,
	timerIcon,
	timerIconAlt,
	magnifyingGlassIcon,
	clipboardTextIcon,
	usersIcon,
	carSimpleIcon,
	bicycleIcon,
	pedestrianIcon,
	gearIcon,
	xIcon,
	tagIcon,
	shareIcon,
	penIcon,
} from '../assets/icons/wallet';
import {
	chevronRightIcon,
	leftArrowIcon,
	rightArrowIcon,
	checkmarkIcon,
	copyIcon,
	faceIdIcon,
	touchIdIcon,
} from '../assets/icons/settings';
import { logo } from '../assets/icons/onboarding';
import _SafeAreaView from '../components/SafeAreaView';

export const DismissIcon = styled(SvgXml).attrs((props) => ({
	xml: dismiss(props?.color ? props.theme.colors[props.color] : 'white'),
	height: props?.height ?? '16px',
	width: props?.width ?? '14px',
	color: undefined,
}))({});

export const CameraIcon = styled(SvgXml).attrs((props) => ({
	xml: camera(props?.color ? props.theme.colors[props.color] : '#636366'),
	height: props?.height ?? '20.53px',
	width: props?.width ?? '20.54px',
	color: undefined,
}))({});

export const SettingsIcon = styled(SvgXml).attrs((props) => ({
	xml: settings(props?.color ? props.theme.colors[props.color] : 'white'),
	height: props?.height ?? '24px',
	width: props?.width ?? '24px',
	color: undefined,
}))({});

export const TransferIcon = styled(SvgXml).attrs((props) => ({
	xml: transferIcon(props?.color ? props.theme.colors[props.color] : '#636366'),
	height: props?.height ?? '19.8px',
	width: props?.width ?? '21.6px',
	color: undefined,
}))({});

export const CoinsIcon = styled(SvgXml).attrs((props) => ({
	xml: coinsIcon(props?.color ? props.theme.colors[props.color] : '#F7931A'),
	height: props?.height ?? '12.8',
	width: props?.width ?? '12.8',
	color: undefined,
}))({});

export const UserPlusIcon = styled(SvgXml).attrs((props) => ({
	xml: userPlusIcon(props?.color ? props.theme.colors[props.color] : 'white'),
	height: props?.height ?? '32px',
	width: props?.width ?? '32px',
	color: undefined,
}))({});

export const GitBranchIcon = styled(SvgXml).attrs((props) => ({
	xml: gitBranchIcon(
		props?.color ? props.theme.colors[props.color] : '#F75C1A',
	),
	height: props?.height ?? '16px',
	width: props?.width ?? '16px',
	color: undefined,
}))({});

export const NoteIcon = styled(SvgXml).attrs((props) => ({
	xml: noteIcon(props?.color ? props.theme.colors[props.color] : '#F75C1A'),
	height: props?.height ?? '16px',
	width: props?.width ?? '16px',
	color: undefined,
}))({});

export const CheckCircleIcon = styled(SvgXml).attrs((props) => ({
	xml: checkCircleIcon(
		props?.color ? props.theme.colors[props.color] : 'white',
	),
	height: props?.height ?? '16px',
	width: props?.width ?? '16px',
	color: undefined,
}))({});

export const ClockIcon = styled(SvgXml).attrs((props) => ({
	xml: clockIcon(props?.color ? props.theme.colors[props.color] : 'white'),
	height: props?.height ?? '16px',
	width: props?.width ?? '16px',
	color: undefined,
}))({});

export const TimerIcon = styled(SvgXml).attrs((props) => ({
	xml: timerIcon(props?.color ? props.theme.colors[props.color] : 'white'),
	height: props?.height ?? '16px',
	width: props?.width ?? '16px',
	color: undefined,
}))({});

export const TimerIconAlt = styled(SvgXml).attrs((props) => ({
	xml: timerIconAlt(props?.color ? props.theme.colors[props.color] : 'white'),
	height: props?.height ?? '16px',
	width: props?.width ?? '16px',
	color: undefined,
}))({});

export const MagnifyingGlassIcon = styled(SvgXml).attrs((props) => ({
	xml: magnifyingGlassIcon(
		props?.color ? props.theme.colors[props.color] : 'gray1',
	),
	height: props?.height ?? '20px',
	width: props?.width ?? '20px',
	color: undefined,
}))({});

export const ClipboardTextIcon = styled(SvgXml).attrs((props) => ({
	xml: clipboardTextIcon(
		props?.color ? props.theme.colors[props.color] : 'white',
	),
	height: props?.height ?? '32px',
	width: props?.width ?? '32px',
	color: undefined,
}))({});

export const UsersIcon = styled(SvgXml).attrs((props) => ({
	xml: usersIcon(props?.color ? props.theme.colors[props.color] : 'white'),
	height: props?.height ?? '32px',
	width: props?.width ?? '32px',
	color: undefined,
}))({});

export const CarSimpleIcon = styled(SvgXml).attrs((props) => ({
	xml: carSimpleIcon(props?.color ? props.theme.colors[props.color] : 'white'),
	height: props?.height ?? '32px',
	width: props?.width ?? '32px',
	color: undefined,
}))({});

export const BicycleIcon = styled(SvgXml).attrs((props) => ({
	xml: bicycleIcon(props?.color ? props.theme.colors[props.color] : 'white'),
	height: props?.height ?? '32px',
	width: props?.width ?? '32px',
	color: undefined,
}))({});

export const PedestrianIcon = styled(SvgXml).attrs((props) => ({
	xml: pedestrianIcon(props?.color ? props.theme.colors[props.color] : 'white'),
	height: props?.height ?? '32px',
	width: props?.width ?? '32px',
	color: undefined,
}))({});

export const GearIcon = styled(SvgXml).attrs((props) => ({
	xml: gearIcon(props?.color ? props.theme.colors[props.color] : 'white'),
	height: props?.height ?? '32px',
	width: props?.width ?? '32px',
	color: undefined,
}))({});

export const XIcon = styled(SvgXml).attrs((props) => ({
	xml: xIcon(props?.color ? props.theme.colors[props.color] : 'white'),
	height: props?.height ?? '32px',
	width: props?.width ?? '32px',
	color: undefined,
}))({});

export const TagIcon = styled(SvgXml).attrs((props) => ({
	xml: tagIcon(props?.color ? props.theme.colors[props.color] : 'white'),
	height: props?.height ?? '32px',
	width: props?.width ?? '32px',
	color: undefined,
}))({});

export const ShareIcon = styled(SvgXml).attrs((props) => ({
	xml: shareIcon(props?.color ? props.theme.colors[props.color] : 'white'),
	height: props?.height ?? '32px',
	width: props?.width ?? '32px',
	color: undefined,
}))({});

export const PenIcon = styled(SvgXml).attrs((props) => ({
	xml: penIcon(props?.color ? props.theme.colors[props.color] : 'white'),
	height: props?.height ?? '32px',
	width: props?.width ?? '32px',
	color: undefined,
}))({});

export const BoostIcon = styled(SvgXml).attrs((props) => ({
	xml: boost(),
	width: props?.width ?? '39px',
	color: undefined,
	height: props?.height ?? '39px',
}))({});

export const BitcoinIcon = styled(SvgXml).attrs((props) => ({
	xml: bitcoinIcon(props?.color ? props.theme.colors[props.color] : '#ED8452'),
	height: props?.height ?? '19.8px',
	width: props?.width ?? '21.6px',
	color: undefined,
}))({});

export const BitcoinCircleIcon = styled(SvgXml).attrs((props) => ({
	xml: bitcoinCircleIcon(
		props?.color ? props.theme.colors[props.color] : '#F7931A',
	),
	height: props?.height ?? '32px',
	width: props?.width ?? '32px',
	color: undefined,
}))({});

export const TetherCircleIcon = styled(SvgXml).attrs((props) => ({
	xml: tetherCircleIcon(
		props?.color ? props.theme.colors[props.color] : '#50AF95',
	),
	height: props?.height ?? '32px',
	width: props?.width ?? '32px',
	color: undefined,
}))({});

export const LightningIcon = styled(SvgXml).attrs((props) => ({
	xml: lightningIcon(
		props?.color ? props.theme.colors[props.color] : '#B95CE8',
	),
	height: props?.height ?? '19.8px',
	width: props?.width ?? '21.6px',
	color: undefined,
}))({});

export const SendIcon = styled(SvgXml).attrs((props) => ({
	xml: sentIcon(props?.color ? props.theme.colors[props.color] : 'white'),
	height: props?.height ?? '17px',
	width: props?.width ?? '17px',
	color: undefined,
}))({});

export const ReceiveIcon = styled(SvgXml).attrs((props) => ({
	xml: receivedIcon(props?.color ? props.theme.colors[props.color] : 'white'),
	height: props?.height ?? '17px',
	width: props?.width ?? '17px',
	color: undefined,
}))({});

export const ChevronRight = styled(SvgXml).attrs((props) => ({
	xml: chevronRightIcon(
		props?.color ? props.theme.colors[props.color] : 'white',
	),
	height: props?.height ?? '12px',
	width: props?.width ?? '12px',
	color: undefined,
}))({});

export const LeftArrow = styled(SvgXml).attrs((props) => ({
	xml: leftArrowIcon(
		props?.color ? props.theme.colors[props.color] : props.theme.colors.gray2,
	),
	height: props?.height ?? '16.04px',
	width: props?.width ?? '20px',
	color: undefined,
}))({});

export const RightArrow = styled(SvgXml).attrs((props) => ({
	xml: rightArrowIcon(
		props?.color ? props.theme.colors[props.color] : props.theme.colors.white,
	),
	height: props?.height ?? '24px',
	width: props?.width ?? '24px',
	color: undefined,
}))({});

export const Checkmark = styled(SvgXml).attrs((props) => ({
	xml: checkmarkIcon(
		props?.color ? props.theme.colors[props.color] : props.theme.colors.green2,
	),
	height: props?.height ?? '16px',
	width: props?.width ?? '16px',
	color: undefined,
}))({});

export const CopyIcon = styled(SvgXml).attrs((props) => ({
	xml: copyIcon(
		props?.color ? props.theme.colors[props.color] : props.theme.colors.brand,
	),
	height: props?.height ?? '16px',
	width: props?.width ?? '16px',
	color: undefined,
}))({});

export const FaceIdIcon = styled(SvgXml).attrs((props) => ({
	xml: faceIdIcon(
		props?.color ? props.theme.colors[props.color] : props.theme.colors.brand,
	),
	height: props?.height ?? '133px',
	width: props?.width ?? '133px',
	color: undefined,
}))({});

export const TouchIdIcon = styled(SvgXml).attrs((props) => ({
	xml: touchIdIcon(
		props?.color ? props.theme.colors[props.color] : props.theme.colors.brand,
	),
	height: props?.height ?? '133px',
	width: props?.width ?? '133px',
	color: undefined,
}))({});

export const Logo = styled(SvgXml).attrs((props) => ({
	xml: logo(
		props?.color ? props.theme.colors[props.color] : props.theme.colors.brand,
	),
	height: props?.height ?? '46px',
	width: props?.width ?? '46px',
	color: undefined,
}))({});

export const ProfileIcon = styled(SvgXml).attrs((props) => ({
	xml: profileIcon(props?.color ? props.theme.colors[props.color] : 'white'),
	height: props?.height ?? '24px',
	width: props?.width ?? '24px',
	color: undefined,
}))({});

export const Display = styled.Text((props) => ({
	...sanFranciscoWeights.medium,
	color: props.color
		? props.theme.colors[props.color]
		: props.theme.colors.text,
	fontFamily: props.font
		? props.theme.fonts[props.font].fontFamily
		: sanFranciscoWeights.medium.fontFamily,
	fontSize: props.size ? props.size : '48px',
	lineHeight: props.lineHeight,
}));

export const DisplayHaas = styled(Display)`
	font-family: 'NHaasGroteskDSW02-65Md';
`;

export const Headline = styled.Text((props) => ({
	...sanFranciscoWeights.medium,
	color: props.color
		? props.theme.colors[props.color]
		: props.theme.colors.text,
	fontFamily: props.font
		? props.theme.fonts[props.font].fontFamily
		: sanFranciscoWeights.medium.fontFamily,
	fontSize: props.size ? props.size : '34px',
}));

export const Title = styled.Text((props) => ({
	...sanFranciscoWeights.medium,
	color: props.color
		? props.theme.colors[props.color]
		: props.theme.colors.text,
	fontFamily: props.font
		? props.theme.fonts[props.font].fontFamily
		: sanFranciscoWeights.medium.fontFamily,
	fontSize: props.size ? props.size : '22px',
}));

export const TitleHaas = styled(Title)`
	font-family: 'NHaasGroteskDSW02-65Md';
`;

export const Subtitle = styled.Text((props) => ({
	...sanFranciscoWeights.bold,
	color: props.color
		? props.theme.colors[props.color]
		: props.theme.colors.text,
	fontFamily: props.font
		? props.theme.fonts[props.font].fontFamily
		: sanFranciscoWeights.bold.fontFamily,
	fontSize: props.size ? props.size : '18px',
}));

export const Text01M = styled.Text((props) => ({
	...sanFranciscoWeights.medium,
	color: props.color
		? props.theme.colors[props.color]
		: props.theme.colors.text,
	fontFamily: props.font
		? props.theme.fonts[props.font].fontFamily
		: sanFranciscoWeights.medium.fontFamily,
	fontSize: props.size ? props.size : '17px',
}));

export const Text01S = styled.Text((props) => ({
	...sanFranciscoWeights.regular,
	color: props.color
		? props.theme.colors[props.color]
		: props.theme.colors.text,
	fontFamily: props.font
		? props.theme.fonts[props.font].fontFamily
		: sanFranciscoWeights.regular.fontFamily,
	fontSize: props.size ? props.size : '17px',
}));

export const Text01B = styled.Text((props) => ({
	...sanFranciscoWeights.bold,
	color: props.color
		? props.theme.colors[props.color]
		: props.theme.colors.text,
	fontFamily: props.font
		? props.theme.fonts[props.font].fontFamily
		: sanFranciscoWeights.bold.fontFamily,
	fontSize: props.size ? props.size : '17px',
}));

export const Text02M = styled.Text((props) => ({
	...sanFranciscoWeights.medium,
	color: props.color
		? props.theme.colors[props.color]
		: props.theme.colors.text,
	fontFamily: props.font
		? props.theme.fonts[props.font].fontFamily
		: sanFranciscoWeights.medium.fontFamily,
	fontSize: props.size ? props.size : '15px',
}));

export const Text02B = styled.Text((props) => ({
	...sanFranciscoWeights.bold,
	color: props.color
		? props.theme.colors[props.color]
		: props.theme.colors.text,
	fontFamily: props.font
		? props.theme.fonts[props.font].fontFamily
		: sanFranciscoWeights.medium.fontFamily,
	fontSize: props.size ? props.size : '15px',
}));

export const Text02S = styled.Text((props) => ({
	...sanFranciscoWeights.regular,
	color: props.color
		? props.theme.colors[props.color]
		: props.theme.colors.text,
	fontFamily: props.font
		? props.theme.fonts[props.font].fontFamily
		: sanFranciscoWeights.regular.fontFamily,
	fontSize: props.size ? props.size : '15px',
}));

export const SubHeadM = styled.Text((props) => ({
	...sanFranciscoWeights.medium,
	color: props.color
		? props.theme.colors[props.color]
		: props.theme.colors.text,
	fontFamily: props.font
		? props.theme.fonts[props.font].fontFamily
		: sanFranciscoWeights.medium.fontFamily,
	fontWeight: 500,
	fontSize: props.size ? props.size : '14px',
}));

export const Caption13M = styled.Text((props) => ({
	...sanFranciscoWeights.medium,
	color: props.color
		? props.theme.colors[props.color]
		: props.theme.colors.text,
	fontFamily: props.font
		? props.theme.fonts[props.font].fontFamily
		: sanFranciscoWeights.medium.fontFamily,
	fontSize: props.size ? props.size : '13px',
}));

export const Caption13S = styled.Text((props) => ({
	...sanFranciscoWeights.regular,
	color: props.color ? props.theme.colors[props.color] : '#636366',
	fontFamily: props.font
		? props.theme.fonts[props.font].fontFamily
		: sanFranciscoWeights.regular.fontFamily,
	fontSize: props.size ? props.size : '13px',
}));

export const Caption13Up = styled.Text((props) => ({
	...sanFranciscoWeights.semibold,
	color: props.color ? props.theme.colors[props.color] : '#636366',
	fontFamily: props.font
		? props.theme.fonts[props.font].fontFamily
		: sanFranciscoWeights.semibold.fontFamily,
	fontSize: props.size ? props.size : '13px',
}));

export const Text13S = styled.Text((props) => ({
	...sanFranciscoWeights.regular,
	color: props.color
		? props.theme.colors[props.color]
		: props.theme.colors.text,
	fontFamily: props.font
		? props.theme.fonts[props.font].fontFamily
		: sanFranciscoWeights.regular.fontFamily,
	fontSize: props.size ? props.size : '13px',
}));

export const Text13UP = styled.Text((props) => ({
	...sanFranciscoWeights.medium,
	color: props.color
		? props.theme.colors[props.color]
		: props.theme.colors.text,
	fontFamily: props.font
		? props.theme.fonts[props.font].fontFamily
		: sanFranciscoWeights.medium.fontFamily,
	fontSize: props.size ? props.size : '13px',
}));

export const SafeAreaView = styled(_SafeAreaView)`
	flex: 1;
	background-color: ${(props): string => props.theme.colors.background};
`;

export const Container = styled.View((props) => ({
	flex: 1,
	backgroundColor: props.theme.colors.background,
}));

export const View = styled.View((props) => ({
	backgroundColor: props.color
		? props.theme.colors[props.color]
		: props.theme.colors.background,
}));

export const AnimatedView = styled(Animated.View)((props) => ({
	backgroundColor: props.color
		? props.theme.colors[props.color]
		: props.theme.colors.background,
}));

export const TouchableOpacity = styled.TouchableOpacity((props) => ({
	backgroundColor: props.color
		? props.theme.colors[props.color]
		: props.theme.colors.background,
}));

export const Pressable = styled.Pressable((props) => ({
	backgroundColor: props.color
		? props.theme.colors[props.color]
		: props.theme.colors.background,
	opacity: props.disabled ? 0.4 : 1,
}));

export const ScrollView = styled.ScrollView((props) => ({
	backgroundColor: props.color
		? props.theme.colors[props.color]
		: props.theme.colors.background,
}));

export const TextInput = styled.TextInput.attrs((props) => ({
	selectionColor: colors.brand,
	placeholderTextColor: props?.placeholderTextColor
		? props.placeholderTextColor
		: props.theme.colors.white5,
}))((props) => ({
	backgroundColor: props.backgroundColor
		? props.theme.colors[props.color]
		: props.theme.colors.white08,
	color: props.color
		? props.theme.colors[props.color]
		: props.theme.colors.text,
	borderColor: props.color
		? props.theme.colors[props.color]
		: props.theme.colors.text,
}));

export const RefreshControl = styled.RefreshControl.attrs((props) => ({
	tintColor: props.theme.colors.refreshControl,
}))({});

export const StatusBar = styled.StatusBar.attrs((props) => ({
	animated: true,
	barStyle:
		Platform.OS === 'android'
			? 'light-content'
			: props.theme.id === 'light'
			? 'dark-content'
			: 'light-content',
}))({});

export const Text = styled.Text((props) => ({
	...sanFranciscoWeights.medium,
	color: props.color
		? props.theme.colors[props.color]
		: props.theme.colors.text,
	fontFamily: props.font
		? props.theme.fonts[props.font].fontFamily
		: sanFranciscoWeights.medium.fontFamily,
	fontWeight: props.font
		? props.theme.fonts[props.font].fontWeight
		: sanFranciscoWeights.medium.fontWeight,
}));

export const RadioButtonRN = styled(_RadioButtonRN).attrs((props) => ({
	box: props?.box ? props.box : false,
	textStyle: props?.textStyle
		? props.textStyle
		: { color: props.theme.colors.text },
	activeColor: props?.activeColor
		? props.activeColor
		: props.theme.colors.onBackground,
}))({});

export const Feather = styled(_Feather).attrs((props) => ({
	color: props.color
		? props.theme.colors[props.color]
		: props.theme.colors.text,
}))({});

export const MaterialIcons = styled(_MaterialIcons).attrs((props) => ({
	color: props.color
		? props.theme.colors[props.color]
		: props.theme.colors.text,
}))({});

export const AntDesign = styled(_AntDesign).attrs((props) => ({
	color: props.color
		? props.theme.colors[props.color]
		: props.theme.colors.text,
}))({});

export const EvilIcon = styled(_EvilIcon).attrs((props) => ({
	color: props.color
		? props.theme.colors[props.color]
		: props.theme.colors.text,
}))({});

export const Ionicons = styled(_Ionicons).attrs((props) => ({
	color: props.color
		? props.theme.colors[props.color]
		: props.theme.colors.text,
}))({});

export const SafeAreaProvider = styled(_SafeAreaProvider)`
	flex: 1;
	background-color: ${(props): string => props.theme.colors.background};
`;

export const NavigationContainer = styled(_NavigationContainer).attrs(
	(props) => ({
		independent: true,
		theme: {
			...DefaultTheme,
			colors: {
				...DefaultTheme.colors,
				card: 'transparent',
				text: props.theme.colors.text,
				background: 'transparent',
				primary: 'transparent',
				border: 'transparent',
			},
		},
	}),
)({});

export const Switch = styled(_Switch).attrs((props) => ({
	trackColor: { false: '#767577', true: props.theme.colors.brand },
	thumbColor: 'white',
	ios_backgroundColor: '#3e3e3e',
	...props,
}))({});
