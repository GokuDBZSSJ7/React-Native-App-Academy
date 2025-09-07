import React from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    Modal, 
    StyleSheet,
    ScrollView,
    Alert
} from 'react-native';
import { baseStyles } from '../styles/mainStyle';

interface SettingsModalProps {
    visible: boolean;
    onClose: () => void;
    onResetData: () => Promise<void>;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
    visible,
    onClose,
    onResetData
}) => {
    const handleResetData = async () => {
        Alert.alert(
            'Limpar Todos os Dados',
            'Tem certeza que deseja apagar todos os exercícios, treinos e progresso? Esta ação não pode ser desfeita.',
            [
                { text: 'Cancelar', style: 'cancel' },
                { 
                    text: 'Limpar Tudo', 
                    style: 'destructive',
                    onPress: async () => {
                        await onResetData();
                        onClose();
                    }
                }
            ]
        );
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={[baseStyles.gradientCard, styles.modal]}>
                    <Text style={[baseStyles.header, styles.title]}>
                        Configurações
                    </Text>

                    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                        <View style={styles.section}>
                            <Text style={[baseStyles.subHeader, styles.sectionTitle]}>
                                Dados e Armazenamento
                            </Text>
                            
                            <View style={styles.infoBox}>
                                <Text style={[baseStyles.captionText, styles.infoLabel]}>
                                    Status do Armazenamento
                                </Text>
                                <Text style={[baseStyles.bodyText, styles.infoValue]}>
                                    ✅ Dados salvos automaticamente
                                </Text>
                                <Text style={[baseStyles.smallText, styles.infoDescription]}>
                                    Seus exercícios, treinos e progresso são salvos automaticamente no dispositivo.
                                </Text>
                            </View>

                            <TouchableOpacity
                                style={[baseStyles.secondaryButton, styles.resetButton]}
                                onPress={handleResetData}
                            >
                                <Text style={baseStyles.secondaryButtonText}>
                                    Limpar Todos os Dados
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.section}>
                            <Text style={[baseStyles.subHeader, styles.sectionTitle]}>
                                Sobre o App
                            </Text>
                            
                            <View style={styles.infoBox}>
                                <Text style={[baseStyles.bodyText, styles.appInfo]}>
                                    Level Up Gym v1.0.0
                                </Text>
                                <Text style={[baseStyles.smallText, styles.appDescription]}>
                                    Transforme seus treinos em progresso com o sistema de leveling inspirado em Solo Leveling.
                                </Text>
                            </View>

                            <View style={styles.infoBox}>
                                <Text style={[baseStyles.captionText, styles.infoLabel]}>
                                    Funcionalidades
                                </Text>
                                <Text style={[baseStyles.smallText, styles.infoDescription]}>
                                    • Sistema de XP e leveling{'\n'}
                                    • Gerenciamento de exercícios{'\n'}
                                    • Criação de treinos personalizados{'\n'}
                                    • Acompanhamento de progresso{'\n'}
                                    • Conquistas e estatísticas
                                </Text>
                            </View>
                        </View>
                    </ScrollView>

                    <TouchableOpacity
                        style={[baseStyles.modernButton, styles.closeButton]}
                        onPress={onClose}
                    >
                        <Text style={baseStyles.buttonText}>Fechar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        width: '90%',
        maxHeight: '85%',
        padding: 28,
    },
    title: {
        textAlign: 'center',
        marginBottom: 28,
    },
    content: {
        marginBottom: 28,
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        marginBottom: 20,
        textAlign: 'center',
        color: '#8B5CF6',
    },
    infoBox: {
        backgroundColor: '#2A2A2A',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#3A3A3A',
    },
    infoLabel: {
        marginBottom: 8,
        color: '#9CA3AF',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    infoValue: {
        marginBottom: 8,
        color: '#10B981',
        fontWeight: '600',
    },
    infoDescription: {
        color: '#9CA3AF',
        lineHeight: 20,
        opacity: 0.8,
    },
    appInfo: {
        marginBottom: 8,
        color: '#3B82F6',
        fontWeight: '600',
        textAlign: 'center',
    },
    appDescription: {
        textAlign: 'center',
        color: '#9CA3AF',
        lineHeight: 20,
        opacity: 0.8,
    },
    resetButton: {
        marginTop: 8,
        borderColor: '#EF4444',
    },
    closeButton: {
        backgroundColor: '#8B5CF6',
    },
});
