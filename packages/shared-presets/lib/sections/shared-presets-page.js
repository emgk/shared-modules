import React, { Component, Children } from 'react';
import styled from 'styled-components';

import { Box, BoxHeader, BoxBody, BoxFooter } from '@wpmudev/react-box';
import { Notifications } from '@wpmudev/react-notifications';
import { Button } from '@wpmudev/react-button';
import { PresetsAccordionItem } from '../elements/accordion-item';

// UTILS: Default Values.
const utils = {
	gutter: 30,
	gutter_md: 20
};

const screen = {
	mobile: 480,
	tablet: 783,
	laptop: 1200,
	desktop: 1500
};

const device = {
	mobile: `(min-width: ${screen.mobile}px)`,
	tablet: `(min-width: ${screen.tablet}px)`,
	laptop: `(min-width: ${screen.laptop}px)`,
	desktop: `(min-width: ${screen.desktop}px)`
};

const NoticeBlue = styled.div`
.sui-wrap && {
    display: flex;
    flex-flow: row wrap;

    > img {
        max-width: 100px;
        display: none;
        align-self: flex-end;
        flex: 0 0 auto;
        margin-right: 30px;
    }

    > div.sui-notice {
        min-width: 1px;
        flex: 1;
        padding-bottom: ${utils.gutter_md};
    }

    @media ${device.tablet} {

        > img {
            display: block;
        }

        > div.sui-notice {
            padding-bottom: ${utils.gutter};
        }
    }
}
`;

export class PresetsPage extends Component {
    constructor( props ) {
        super( props );

        this.state = {
            free: false,
            empty: false,
            loading: false
        }
    }

    componentDidMount() {
        const items = this.props.children;
        const freez = this.props.free || {};
        
        let isFree = false;

        // Check if free state exists.
        if ( freez.state && 'undefined' !== typeof freez.state ) {
            
            // Check if free state is boolean.
            if ( 'boolean' && typeof freez.state ) {
                isFree = freez.state;
            }
        }

        if ( 0 === items.length ) {
            this.setState({
                empty: true
            });
        }

        this.setState({
            free: isFree
        });
    }

    render() {
        const { free, empty } = this.state;
        const welcome = this.props.welcome || {};
        const update = this.props.update || {};
        const freez = this.props.free || {};

        const items = Children.map( this.props.children, item => {
            return (
                <PresetsAccordionItem
                    default={ item.props.default || false }
                    title={ item.props.title }
                    description={ item.props.description }
                    image={ item.props.image }
                    applyLabel={ item.props.applyLabel }
                    applyAction={ item.props.applyAction }
                    downloadLabel={ item.props.downloadLabel }
                    editLabel={ item.props.editLabel }
                    editAction={ item.props.editAction }
                    deleteLabel={ item.props.deleteLabel }
                >
                    { item.props.children }
                </PresetsAccordionItem>
            );
        });

        return (
            <Box>

                <BoxHeader title={ this.props.title }>
                    <div>
                        <Button
                            icon="upload-cloud"
                            label={ this.props.uploadLabel || 'Upload' }
                            design="ghost"
                        />
                        <Button
                            icon="save"
                            label={ this.props.saveLabel || 'Save Config' }
                            color="blue"
                        />
                    </div>
                </BoxHeader>

                <BoxBody
                    paddingBottom={ welcome.message ? 0 : 30 }
                >

                    { this.props.description && (
                        <p>{ this.props.description }</p>
                    )}

                    { welcome.message && (
                        <NoticeBlue>
                            
                            <img
                                src={ welcome.image }
                                alt={ welcome.imageAlt || '' }
                                aria-hidden="true"
                            />

                            <Notifications type="info" dismiss>
                                <p>{ welcome.message }</p>
                            </Notifications>

                        </NoticeBlue>
                    )}

                </BoxBody>

                { !empty && (
                    <div
                        className="sui-accordion sui-accordion-flushed"
                        style={ {
                            borderBottomWidth: 0
                        } }
                    >
                        { items }
                    </div>
                )}

                { free && freez.message && '' !== freez.message && (
                    <BoxFooter
                        display="block"
                    >
                        <Notifications type="upsell">
                            <p>{ freez.message }</p>
                            { freez.button && '' !== freez.message && (
                                <p>
                                    <Button
                                        label={ freez.button }
                                        color="purple"
                                        href="https://wpmudev.com/"
                                        target="_blank"
                                    />
                                </p>
                            )}
                        </Notifications>
                    </BoxFooter>
                )}

                { !free && (
                    <BoxFooter
                        display="block"
                        alignment="center"
                    >
                        <p className="sui-description">{ update.message }</p>
                    </BoxFooter>
                )}

            </Box>
        );
    }
}