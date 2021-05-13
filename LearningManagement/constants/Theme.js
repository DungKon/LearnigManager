import { StyleSheet, Platform, StatusBar } from 'react-native'
import { Dimensions } from 'react-native';

const colors = {
    home: "#009387",
    schedule: "#3B5998",
    event:"#694fad",
    document:"#d02860",
    active: "#FED700",
    blue: "#2E5BFF",
    green: "#33AC2E",
    red: "#EC1C24",
    red1: "#941A08",
    yellow: "#F7C137",
    brown: '#8C3F06',
    dark: "#000000",
    white: "#FFFFFF",
    gray: "#BFC5D2",
    caption: "#69707F",
    border: "#D6DDF6",
    card: "rgba(46,91,255,0.08)",
    shadow: "rgba(46,91,255,0.07)",
  };

  const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems:"center",
        justifyContent:'center'
    },
})

export {
    colors,
    styles,
};