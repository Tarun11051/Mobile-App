import {StyleSheet,View,Text} from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Button } from 'react-native';

const YellowScreen = () => {
    const navigation = useNavigation();
    return (
        <View style={styles.conatiner}>
            <Text style={{color:"#fff",fontSize:30}}>Yellow Screen</Text>
            <Button title="Go to Green Screen" onPress={() => navigation.navigate('GreenScreen')} />
            <Button title="Go to Gold Screen" onPress={() => navigation.navigate('GoldScreen')} />
        </View>
    );
};

export default YellowScreen;

const styles=StyleSheet.create({
    conatiner:{
        flex:1,
        backgroundColor:"yellow",
        justifyContent:"center",
        alignItems:"center"
    }

})