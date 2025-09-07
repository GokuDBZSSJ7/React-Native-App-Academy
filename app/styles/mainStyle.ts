import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get('window');

export const baseStyles = StyleSheet.create({
    container: {
        minHeight: height,
        minWidth: width,
        flex: 1
    },

    primaryBg: {
        backgroundColor: "#0A0A0A"
    },

    secondaryBg: {
        backgroundColor: "#1A1A1A"
    },

    tertiaryBg: {
        backgroundColor: "#2A2A2A"
    },

    primaryColor: {
        backgroundColor: "#3B82F6"
    },

    secondaryColor: {
        backgroundColor: "#8B5CF6"
    },

    accent: {
        backgroundColor: "#10B981"
    },

    primaryText: {
        color: "#FFFFFF"
    },

    secondaryText: {
        color: "#9CA3AF"
    },

    success: {
        color: "#10B981"
    },

    warning: {
        color: "#F59E0B"
    },

    danger: {
        color: "#EF4444"
    },

    // Componentes modernos
    card: {
        backgroundColor: "#1A1A1A",
        borderRadius: 20,
        padding: 24,
        marginVertical: 12,
        marginHorizontal: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 12,
        borderWidth: 1,
        borderColor: "#2A2A2A",
    },

    xpBar: {
        height: 6,
        backgroundColor: "#2A2A2A",
        borderRadius: 3,
        overflow: 'hidden',
    },

    xpProgress: {
        height: '100%',
        backgroundColor: "#3B82F6",
        borderRadius: 3,
    },

    levelBadge: {
        backgroundColor: "#8B5CF6",
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 8,
        alignSelf: 'flex-start',
    },

    button: {
        backgroundColor: "#3B82F6",
        borderRadius: 16,
        paddingVertical: 18,
        paddingHorizontal: 28,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#3B82F6",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },

    buttonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.5,
    },

    input: {
        backgroundColor: "#2A2A2A",
        borderRadius: 16,
        paddingHorizontal: 20,
        paddingVertical: 16,
        color: "#FFFFFF",
        fontSize: 16,
        marginVertical: 12,
        borderWidth: 1,
        borderColor: "#3A3A3A",
    },

    header: {
        fontSize: 32,
        fontWeight: '700',
        color: "#FFFFFF",
        marginBottom: 24,
        textAlign: 'center',
        letterSpacing: -0.5,
    },

    subHeader: {
        fontSize: 24,
        fontWeight: '600',
        color: "#FFFFFF",
        marginBottom: 20,
        letterSpacing: -0.3,
    },

    text: {
        fontSize: 16,
        color: "#FFFFFF",
        lineHeight: 24,
        fontWeight: '400',
    },

    smallText: {
        fontSize: 14,
        color: "#9CA3AF",
        fontWeight: '400',
    },

    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    center: {
        alignItems: 'center',
        justifyContent: 'center',
    },

    spaceBetween: {
        justifyContent: 'space-between',
    },

    flex1: {
        flex: 1,
    },

    marginTop: {
        marginTop: 20,
    },

    marginBottom: {
        marginBottom: 20,
    },

    padding: {
        padding: 20,
    },

    // Novos estilos modernos
    gradientCard: {
        backgroundColor: "#1A1A1A",
        borderRadius: 24,
        padding: 28,
        marginVertical: 16,
        marginHorizontal: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 16,
        borderWidth: 1,
        borderColor: "#2A2A2A",
    },

    subtleBorder: {
        borderWidth: 1,
        borderColor: "#2A2A2A",
    },

    glassEffect: {
        backgroundColor: "rgba(26, 26, 26, 0.8)",
    },

    modernButton: {
        backgroundColor: "#3B82F6",
        borderRadius: 20,
        paddingVertical: 20,
        paddingHorizontal: 32,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#3B82F6",
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 12,
    },

    secondaryButton: {
        backgroundColor: "transparent",
        borderRadius: 20,
        paddingVertical: 20,
        paddingHorizontal: 32,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: "#3B82F6",
    },

    secondaryButtonText: {
        color: "#3B82F6",
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.5,
    },

    iconButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: "#3B82F6",
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#3B82F6",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },

    // Tipografia moderna
    displayText: {
        fontSize: 28,
        fontWeight: '800',
        color: "#FFFFFF",
        letterSpacing: -1,
        lineHeight: 56,
    },

    titleText: {
        fontSize: 28,
        fontWeight: '700',
        color: "#FFFFFF",
        letterSpacing: -0.5,
        lineHeight: 36,
    },

    bodyText: {
        fontSize: 18,
        color: "#FFFFFF",
        lineHeight: 28,
        fontWeight: '400',
    },

    captionText: {
        fontSize: 12,
        color: "#9CA3AF",
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
});