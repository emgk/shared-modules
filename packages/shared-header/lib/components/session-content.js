import React, { Fragment } from 'react';
import { isBoolean } from './utils';

// Import required component(s).
import { SessionOn } from './session-on';
import { SessionOff } from './session-off';

// Build "Session Content" component.
const SessionContent = ({ login, pro, user = {}, lang = {} }) => {
	// Check if user is connected.
	const connected = isBoolean(login) && login ? true : false;

	return (
		<Fragment>
			{ connected && <SessionOn name={user.name} email={user.email} pro={pro} /> }

			{ !connected && <SessionOff label={ lang.unplug.label } tooltip={ lang.unplug.tooltip } /> }
		</Fragment>
	);
}

// Publish required component(s).
export { SessionContent }