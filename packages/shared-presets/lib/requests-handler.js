export default class RequestHandler {
	constructor( { apiKey, pluginData, root, nonce, optionName } ) {
		this.apiKey = apiKey;
		this.pluginData = pluginData;
		this.root = root;
		this.nonce = nonce;
		this.optionName = optionName;

		this.getAllLocal = this.getAllLocal.bind( this );
		this.delete = this.delete.bind( this );
	}

	getAllLocal() {
		return this.makeLocalRequest();
	}

	delete( configs, currentConfig ) {
		// Delete from the Hub when the config has a Hub ID and we have an API key.
		if ( this.apiKey && currentConfig.hub_id ) {
			this.makeHubRequest( `/${ currentConfig.hub_id}`, 'DELETE' );
		}

		const configIndex = configs.findIndex( ( element ) => element.id === currentConfig.id );
		if ( -1 !== configIndex ) {
			configs.splice( configIndex, 1 );
		}

		return this.updateLocalConfigsList( configs );
	}

	edit( configs, currentConfig, data ) {
		// Edit in the Hub when the config has a Hub ID and we have an API key.
		if ( this.apiKey && currentConfig.hub_id ) {
			const configData = {
				name: data.get( 'name' ),
				description: data.get( 'description' ),
				package: {
					id: this.pluginData.id,
					name: this.pluginData.name,
				}
			};
			this.makeHubRequest( `/${ currentConfig.hub_id}`, 'PATCH', JSON.stringify( configData ) );
		}
		const configIndex = configs.findIndex( ( element ) => element.id === currentConfig.id );

		if ( -1 !== configIndex ) {
			configs[ configIndex ].name = data.get( 'name' );
			configs[ configIndex ].description = data.get( 'description' );
		}

		return this.updateLocalConfigsList( configs );
	}

	updateLocalConfigsList( newConfigs ) {
		const requestData = {
			[ this.optionName ]: newConfigs,
		};

		return this.makeLocalRequest( 'POST', JSON.stringify( requestData ) );
	}

	/**
	* Promesify xhr requests.
	*
	* @param {*} data Request data.
	* @param {string} verb Request verb.
	* @return {Promise} Promised request.
	*/
	makeLocalRequest( verb = 'GET', data = null ) {
		return new Promise( ( resolve, reject ) => {
			const xhr = new XMLHttpRequest();

			// TODO: double check this. Don't forget multisites.
			xhr.open( verb, `${this.root}wp/v2/settings`, true );
			xhr.setRequestHeader( 'X-WP-Nonce', this.nonce );
			xhr.setRequestHeader( 'Content-type', 'application/json' );
			xhr.onload = () => {
				if ( xhr.status >= 200 && xhr.status < 300 ) {
					const response = JSON.parse( xhr.response ),
						resolveValue = response[ this.optionName ] ? response[ this.optionName ] : null;
					resolve( resolveValue );
				} else {
					reject( {
						status: xhr.status,
					} );
				}
			};
			xhr.onerror = () => {
				reject( {
					status: xhr.status,
				} );
			};
			xhr.send( data );
		});
	};

	syncWithHub() {
		return new Promise( ( resolve, reject ) => {
			let localConfigs, original;
			this.getAllLocal()
				.then( ( response ) => {
					localConfigs = response;
					original = Object.assign( {}, localConfigs );

					// Just use the local configs if no API key is provided.
					if ( ! this.apiKey ) {
						resolve( local );
					}

					return this.makeHubRequest( `?package_id=${ this.pluginData.id }`, 'GET' );
				} )
				.then( ( hubConfigs ) => this.getUpdatedLocalWithHub( localConfigs, hubConfigs ) )
				.then( ( hubPromises ) => {
					for ( const res of hubPromises ) {
						const configData = JSON.parse( res.config );

						localConfigs.push( {
							id: res.id,
							hub_id: res.id,
							name: res.name,
							description: res.description,
							config: configData.configs,
						} );
					}

					return this.updateLocalConfigsList( original );
				} )
				.then ( ( syncRes ) => resolve( syncRes ) )
				.catch( ( res ) => reject( res ) );
		} );
	}

	/**
	 * Syncs the locally stored configs with the Hub.
	 * What this does:
	 * - Sends to the Hub the local configs that weren't sent already.
	 * - Removes local configs that don't exist in the Hub.
	 * - Updates the name and description of the local configs to the ones in the Hub.
	 * - Retrieves the configs that exist in the Hub but not locally.
	 *
	 * @param {array} localConfigs Array with the local configs.
	 * @param {array} hubConfigs Array with the Hub configs.
	 * @returns
	 */
	getUpdatedLocalWithHub( localConfigs, hubConfigs ) {
		const hubConfigsIds = hubConfigs.map( ( currentConfig ) => currentConfig.id ),
			localConfigsIds = {};

		const hubPromises = [];

		for ( const [ index, localOne ] of localConfigs.entries() ) {
			// Skip checks for the basic config.
			if ( 1 === localOne.id ) {
				continue;
			}

			// Send to the Hub the configs that haven't been sent.
			if ( ! localOne.hub_id ) {
				hubPromises.push( this.sendConfigToHub( localOne ) );

				// Remove it locally. We'll add it after the promises resolve.
				// Splice will re-order the indexes. We don't want that.
				// TODO: handle errors. We don't want to delete them locally if the promises fail.
				delete localConfigs[ index ];
				continue;
			}

			// Find the configs that were removed from the hub and remove them locally.
			if ( ! hubConfigsIds[ localOne.hub_id ] ) {
				delete localConfigs[ index ];
				continue;
			}
		}

		return Promise.all( hubPromises );
	}

	sendConfigToHub( config ) {
		const configData = {
			name: config.name,
			description: config.description,
			package: this.pluginData,
		}

		configData.config = JSON.stringify( {
			strings: {
				something: [ 'something else' ],
			},
			configs: config.config,
		} );

		return this.makeHubRequest( '', 'POST', JSON.stringify( configData ) );
	}

	makeHubRequest( path = '', verb = 'GET', data = null ) {
		return new Promise( ( resolve, reject ) => {
			const xhr = new XMLHttpRequest();

			xhr.open( verb, `https://wpmudev.com/api/hub/v1/package-configs${ path }`, true );
			xhr.setRequestHeader( 'Content-type', 'application/json' );
			xhr.setRequestHeader( 'Authorization', 'Basic ' + this.apiKey );
			xhr.onload = () => {
				if ( xhr.status >= 200 && xhr.status < 300 ) {
					resolve( JSON.parse( xhr.response ) );
				} else {
					reject( {
						status: xhr.status,
					} );
				}
			};
			xhr.onerror = () => {
				reject( {
					status: xhr.status,
				} );
			};
			xhr.send( data );
		});
	};
}