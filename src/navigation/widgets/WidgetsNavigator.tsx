import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import {
	createNativeStackNavigator,
	NativeStackNavigationOptions,
	NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import {
	GoodbyePasswords,
	HelloWidgets,
} from '../../screens/Widgets/WidgetsOnboarding';
import WidgetsSuggestions from '../../screens/Widgets/WidgetsSuggestions';
import Store from '../../store/types';

export type WidgetsNavigationProp =
	NativeStackNavigationProp<WidgetsStackParamList>;

export type WidgetsStackParamList = {
	GoodbyePasswords: undefined;
	HelloWidgets: undefined;
	WidgetsSuggestions: undefined;
};

const Stack = createNativeStackNavigator<WidgetsStackParamList>();

const navOptions: NativeStackNavigationOptions = {
	headerShown: false,
};

const WidgetsNavigator = (): ReactElement => {
	const onboardedWidgets = useSelector(
		(state: Store) => state.widgets?.onboardedWidgets,
	);

	return (
		<Stack.Navigator
			initialRouteName={
				onboardedWidgets ? 'WidgetsSuggestions' : 'GoodbyePasswords'
			}>
			<Stack.Group screenOptions={navOptions}>
				<Stack.Screen name="GoodbyePasswords" component={GoodbyePasswords} />
				<Stack.Screen name="HelloWidgets" component={HelloWidgets} />
				<Stack.Screen
					name="WidgetsSuggestions"
					component={WidgetsSuggestions}
				/>
			</Stack.Group>
		</Stack.Navigator>
	);
};

export default WidgetsNavigator;
