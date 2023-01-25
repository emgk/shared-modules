import React, { Fragment } from 'react';

var Header = function Header() {
  return /*#__PURE__*/React.createElement("p", null, "test - header");
};
var Perks = function Perks() {
  return /*#__PURE__*/React.createElement("p", null, "test - perks");
};
var OneTestComponent = function OneTestComponent() {
  return /*#__PURE__*/React.createElement(Fragment, null, /*#__PURE__*/React.createElement("p", null, "One test component:"), /*#__PURE__*/React.createElement("p", null, "Hello world!"));
}; // // Import required component(s).
// import { ButtonIcon } from '@wpmudev/react-button-icon';
// import { SessionContent } from './components/session-content';
// import { SessionList as Perks } from './components/session-list';
// const Header = ({ title, login, pro, landing, tutorials, sourceUser, sourceModal, sourceUnplug, children }) => {
// 	const unplug = Object.assign(
// 		{
// 			label: 'Click to connect',
// 			tooltip: ''
// 		},
// 		sourceUnplug
// 	);
// 	const user = Object.assign(
// 		{
// 			name: '',
// 			email: '',
// 			avatar: ''
// 		},
// 		sourceUser
// 	);
// 	const tuts = Object.assign(
// 		{
// 			label: 'Tutorials',
// 			href: '',
// 			target: '_blank',
// 			cbFunc: ''
// 		},
// 		tutorials
// 	);
// 	const contentTuts = (
// 		<Fragment>
// 			{ !isEmpty(tuts.cbFunc) && (
// 				<ButtonIcon icon="academy" label={tuts.label} onClick={tuts.cbFunc} />
// 			)}
// 			{ (isEmpty(tuts.cbFunc) && !isEmpty(tuts.href)) && (
// 				<ButtonIcon icon="academy" label={tuts.label} href={tuts.href} target={tuts.target} />
// 			)}
// 		</Fragment>
// 	);
// 	const contentLeft = Children.map( children, ( child, index ) => {
// 		if ( 'left' === child.props.slot ) {
// 			return (
// 				<div key={index} className="sui-actions-left">
// 					{child.props.children}
// 				</div>
// 			);
// 		}
// 		return '';
// 	});
// 	const contentRight = Children.map( children, ( child, index ) => {
// 		if ( 'right' === child.props.slot ) {
// 			return (
// 				<Fragment key={index}>
// 					{child.props.children}
// 				</Fragment>
// 			);
// 		}
// 		return '';
// 	});
// 	const contentModal = Children.map( children, ( child, index ) => {
// 		if ( 'modal' === child.props.slot ) {
// 			return (
// 				<Fragment key={index}>
// 					{child.props.children}
// 				</Fragment>
// 			);
// 		}
// 		return '';
// 	});
// 	const modal = Object.assign(
// 		{
// 			title: 'Connect to your WPMU DEV account',
// 			subtitle: 'Connect to WPMU DEV to unlock features for free.',
// 			content: contentModal
// 		},
// 		sourceModal
// 	);
// 	return (
// 		<div className="sui-header">
// 			{(!isUndefined(title) && !isEmpty(title)) && (
// 				<h1 className="sui-header-title">{ title }</h1>
// 			)}
// 			{ contentLeft }
// 			<div className="sui-actions-right">
// 				{ contentRight }
// 				{ contentTuts }
// 				<SessionContent
// 					login={login}
// 					pro={pro}
// 					landing={landing}
// 					user={user}
// 					modal={modal}
// 					lang={{
// 						plug: {},
// 						unplug: {
// 							label: unplug.label,
// 							tooltip: unplug.tooltip
// 						}
// 					}} />
// 			</div>
// 		</div>
// 	);
// }
// export { Header, Perks }

export { Header, OneTestComponent, Perks };
