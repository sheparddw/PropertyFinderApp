import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableHighlight,
    ActivityIndicatorIOS,
    Image,
    Linking
} from 'react-native';
import SearchResults from './SearchResults';

class SearchPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchString: 'london',
            isLoading: false,
            message: ''
        };
    }


    //Create Nestoria API URL to use from input.
    urlForQueryAndPage(key, value, pageNumber) {
        var data = {
            country: 'uk',
            pretty: '1',
            encoding: 'json',
            listing_type: 'buy',
            action: 'search_listings',
            page: pageNumber
        };
        data[key] = value;

        var querystring = Object.keys(data)
        .map(key => key + '=' + encodeURIComponent(data[key]))
        .join('&');

        return 'http://api.nestoria.co.uk/api?' + querystring;
    }

    //On Input Change.
    onSearchTextChanged(event){
        this.setState({searchString: event.nativeEvent.text});
    }

    //Get results via Nestoria API.
    _executeQuery(query) {
        this.setState({isLoading: true, message: ''});
        fetch(query)
            .then(response => response.json())
            .then(json => this._handleResponse(json.response))
            .catch(error =>
               this.setState({
                   isLoading :false,
                   message: 'Something bad happened ' + error
               })
            );
    }

    //If results, 
    _handleResponse(response) {
        this.setState({isLoading: false, message: ''});
        if(response.application_response_code.substr(0,1) === '1'){
            var listings = this.addGuid(response.listings);
            this.props.navigator.push({
                title: 'Results',
                component: SearchResults,
                passProps: {listings: listings}
            });
        } else {
            this.setState({message: 'Location not recognized: please try again.'});
            console.log(response);
        }
    }

    addGuid(properties) {
        properties.map((prop, index) => prop.guid = index);
        return properties;
    }

    //Run search.
    onSearchPressed() {
        var query = this.urlForQueryAndPage('place_name', this.state.searchString, 1);
        this._executeQuery(query);
    }

    //Get User's location.
    onLocationPressed() {
        navigator.geolocation.getCurrentPosition(
            location => {
                var search = location.coords.latitude + ',' + location.coords.longitude;
                this.setState({searchString: search});
                var query = this.urlForQueryAndPage('centre_point', search, 1);
                this._executeQuery(query);
            },
            error => {
                this.setState({
                    message: 'There was a problem with obtaining your location: ' + error
                });
            }
        );
    }

    //Link to Nestoria.
    openNestoriaLink() {
        const url = 'http://www.nestoria.com/';
        Linking.openURL(url).catch(err => console.error('An error occurred', err));
    }

    render() {
        var spinner = this.state.isLoading ? 
            (<ActivityIndicatorIOS
             size='large'/>
            ) :
            (<View/>);
        return (
            <View style={styles.container}>
                <Text style={styles.description}>
                    Search for houses to buy!
                </Text>
                <Text style={styles.description}>
                    Search by place-name, postalcode, or search near your location.
                </Text>
                <View style={styles.flowRight}>
                    <TextInput
                        style={styles.searchInput}
                        value={this.state.searchString}
                        onChange={this.onSearchTextChanged.bind(this)}
                        placeholder='Search via name or postalcode'
                    />
                    <TouchableHighlight style={styles.button}
                        underlayColor='#99d9f4'
                        onPress={this.onSearchPressed.bind(this)}
                    >
                        <Text style={styles.buttonText}>Go</Text>
                    </TouchableHighlight>
                </View>
                <TouchableHighlight style={styles.button}
                    underlayColor='#99d9f4'
                    onPress={this.onLocationPressed.bind(this)}
                >
                    <Text style={styles.buttonText}>Location</Text>
                </TouchableHighlight>
                <Image source={require('./Resources/house.png')} style={styles.image}/>
                {spinner}
                <Text style={styles.description}>{this.state.message}</Text>
                <Text style={styles.description} onPress={this.openNestoriaLink}>Data provided by Nestoria</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    description: {
        marginBottom: 20,
        fontSize: 18,
        textAlign: 'center',
        color: '#656565'
    },
    container: {
        padding: 30,
        marginTop: 65,
        alignItems: 'center'
    },
    flowRight: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch'
    },
    buttonText: {
        fontSize: 18,
        color: 'white',
        alignSelf: 'center'
    },
    button: {
        height: 36,
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#48BBEC',
        borderColor: '#48BBEC',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 10,
        alignSelf: 'stretch',
        justifyContent: 'center'
    },
    searchInput: {
        height: 36,
        flex: 4,
        padding: 4,
        marginRight: 5,
        fontSize: 18,
        borderWidth: 1,
        borderColor: '#48BBEC',
        borderRadius: 8,
        color: '#48BBEC'
    },
    image: {
        width: 217,
        height: 138
    }
});

module.exports = SearchPage;
