import {StyleSheet,View,Text, Button} from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

const GoldScreen = () => {
    const navigation = useNavigation();
    return (
        <View style={styles.conatiner}>
            <Text style={{color:"#fff",fontSize:30}}>Gold Screen</Text>
            <Button title="Go to Green Screen" onPress={() => navigation.navigate('GreenScreen')} />
            <Button title="Go to Yellow Screen" onPress={() => navigation.navigate('YellowScreen')} />
        </View>
    );
};

export default GoldScreen;

const styles=StyleSheet.create({
    conatiner:{
        flex:1,
        backgroundColor:"gold",
        justifyContent:"center",
        alignItems:"center"
    }

})
