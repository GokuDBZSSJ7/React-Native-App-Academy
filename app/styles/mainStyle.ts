import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get('window');

export const baseStyles = StyleSheet.create({
    container: {
        minHeight: height,
        minWidth: width 
    },

    primaryBg: {
        backgroundColor: "#0D0D0F"
    },

    secondaryBg: {
        backgroundColor: "#1A1C20"
    },

    primaryColor: {
        backgroundColor: "#00BFFF"
    },

    secondaryColor: {
        backgroundColor: "#7A5CFF"
    },

    energy: {
        backgroundColor: "#FF3C7E"
    },

    primaryText: {
        color: "#E6E6E6"
    },

    secondaryText: {
        color: "#A0A0A0"
    },

    success: {
        color: "#00FF95"
    }
});