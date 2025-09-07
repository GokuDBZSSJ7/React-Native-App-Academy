import React, { useEffect } from 'react';
import { 
    View, 
    Text, 
    Modal, 
    StyleSheet, 
    Animated,
    Dimensions
} from 'react-native';
import { baseStyles } from '../styles/mainStyle';
import { Achievement } from '../utils/achievements';

interface AchievementUnlockedModalProps {
    visible: boolean;
    achievement: Achievement | null;
    onClose: () => void;
}

const { width } = Dimensions.get('window');

export const AchievementUnlockedModal: React.FC<AchievementUnlockedModalProps> = ({
    visible,
    achievement,
    onClose
}) => {
    const scaleAnim = new Animated.Value(0);
    const opacityAnim = new Animated.Value(0);

    useEffect(() => {
        if (visible && achievement) {
            // Animação de entrada
            Animated.sequence([
                Animated.parallel([
                    Animated.spring(scaleAnim, {
                        toValue: 1,
                        useNativeDriver: true,
                        tension: 100,
                        friction: 8
                    }),
                    Animated.timing(opacityAnim, {
                        toValue: 1,
                        duration: 300,
                        useNativeDriver: true
                    })
                ]),
                // Pausa para mostrar a conquista
                Animated.delay(2000),
                // Animação de saída
                Animated.parallel([
                    Animated.spring(scaleAnim, {
                        toValue: 0.8,
                        useNativeDriver: true,
                        tension: 100,
                        friction: 8
                    }),
                    Animated.timing(opacityAnim, {
                        toValue: 0,
                        duration: 200,
                        useNativeDriver: true
                    })
                ])
            ]).start(() => {
                onClose();
            });
        } else {
            // Reset das animações
            scaleAnim.setValue(0);
            opacityAnim.setValue(0);
        }
    }, [visible, achievement]);

    if (!achievement) return null;

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="none"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <Animated.View 
                    style={[
                        styles.modal,
                        {
                            transform: [{ scale: scaleAnim }],
                            opacity: opacityAnim
                        }
                    ]}
                >
                    {/* Ícone da conquista */}
                    <View style={styles.iconContainer}>
                        <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                    </View>

                    {/* Título */}
                    <Text style={styles.title}>Conquista Desbloqueada!</Text>
                    
                    {/* Nome da conquista */}
                    <Text style={styles.achievementName}>{achievement.name}</Text>
                    
                    {/* Descrição */}
                    <Text style={styles.description}>{achievement.description}</Text>

                    {/* Categoria */}
                    <View style={styles.categoryBadge}>
                        <Text style={styles.categoryText}>
                            {getCategoryDisplayName(achievement.category)}
                        </Text>
                    </View>

                    {/* Mensagem de parabéns */}
                    <Text style={styles.congratsText}>
                        Parabéns! Continue assim! 🎉
                    </Text>
                </Animated.View>
            </View>
        </Modal>
    );
};

// Função para obter o nome de exibição da categoria
function getCategoryDisplayName(category: string): string {
    switch (category) {
        case 'first_time':
            return 'Primeira Vez';
        case 'progress':
            return 'Progresso';
        case 'streak':
            return 'Sequência';
        case 'milestone':
            return 'Milestone';
        case 'special':
            return 'Especial';
        default:
            return category;
    }
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        backgroundColor: '#1A1A1A',
        borderRadius: 24,
        padding: 32,
        alignItems: 'center',
        width: width * 0.85,
        maxWidth: 400,
        borderWidth: 2,
        borderColor: '#10B981',
        shadowColor: '#10B981',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 20,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#10B981',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#10B981',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 12,
    },
    achievementIcon: {
        fontSize: 40,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#10B981',
        marginBottom: 16,
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    achievementName: {
        fontSize: 24,
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: 12,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        color: '#9CA3AF',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 20,
    },
    categoryBadge: {
        backgroundColor: '#2A2A2A',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#3A3A3A',
    },
    categoryText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#8B5CF6',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    congratsText: {
        fontSize: 14,
        color: '#10B981',
        fontWeight: '600',
        textAlign: 'center',
    },
});
