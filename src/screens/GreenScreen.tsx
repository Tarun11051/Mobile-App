import {StyleSheet,View,Text} from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Button } from 'react-native'; 


const GreenScreen = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.conatiner}>
            <Text style={{color:"#fff",fontSize:30}}>Green Screen</Text>
            <Button title="Go to Yellow Screen" onPress={() => navigation.navigate('YellowScreen')} />
            <Button title="Go to Gold Screen" onPress={() => navigation.navigate('GoldScreen')} />
        </View>
    );
};

export default GreenScreen;

const styles=StyleSheet.create({
    conatiner:{
        flex:1,
        backgroundColor:"green",
        justifyContent:"center",
        alignItems:"center"
    }

})