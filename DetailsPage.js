import React from 'react';
import {
    StyleSheet,
    Image,
    View,
    Text,
    Component,
    TouchableHighlight,
    Linking
} from 'react-native';

class DetailsPage extends Component {
    
    //Open More Details page.
    openUrl(url) {
        Linking.openURL(url).catch(err => console.error('An error occurred', err));
    }

    render() {
        var property = this.props.property;
        var stats = property.bedroom_number + ' bed ' + property.property_type;
        if(property.bathroom_number) {
            stats += ', ' + property.bathroom_number + ' ' + (property.bathroom_number > 1 ? 'bathrooms' : 'bathroom');
        }

        //Returns pound symbol and price number.
        var price = property.price_formatted;
        const url = property.lister_url;

        return (
            <View style={styles.container}>
                <Image style={styles.image}
                    source={{uri: property.img_url}} 
                />
                <View style={styles.heading}>
                    <Text style={styles.price}>{price}</Text>
                    <Text style={styles.title}>{property.title}</Text>
                    <View style={styles.separator} />
                </View>
                <Text style={styles.description}>{stats}</Text>
                <Text style={styles.description}>{property.summary}</Text>

                <TouchableHighlight style={styles.button}>
                    <Text style={styles.buttonText} onPress={el => this.openUrl(url)}>More Details</Text>
                </TouchableHighlight>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: 65
    },
    heading: {
        backgroundColor: '#f8f8f8'
    },
    separator: {
        height: 1,
        backgroundColor: '#dddddd'
    },
    image: {
        width: 400,
        height: 300
    },
    price: {
        fontSize: 25,
        fontWeight: 'bold',
        margin: 5,
        color: '#48BBEC'
    },
    title: {
        fontSize: 20,
        margin: 5,
        color: '#656565'
    },
    description: {
        fontSize: 18,
        margin: 5,
        color: '#656565'
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
        margin: 10,
        alignSelf: 'stretch',
        justifyContent: 'center'
    }
});

module.exports = DetailsPage;
