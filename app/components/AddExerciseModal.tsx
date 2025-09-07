import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    Modal, 
    StyleSheet,
    ScrollView
} from 'react-native';
import { baseStyles } from '../styles/mainStyle';
import { Exercise } from '../types';

interface AddExerciseModalProps {
    visible: boolean;
    onClose: () => void;
    onAdd: (exercise: Omit<Exercise, 'id'>) => void;
}

export const AddExerciseModal: React.FC<AddExerciseModalProps> = ({
    visible,
    onClose,
    onAdd
}) => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [initialWeight, setInitialWeight] = useState('');
    const [initialReps, setInitialReps] = useState('');

    const handleAdd = () => {
        if (!name.trim() || !category.trim()) {
            return;
        }

        const newExercise: Omit<Exercise, 'id'> = {
            name: name.trim(),
            category: category.trim(),
            currentLevel: 1,
            currentXP: 0,
            xpToNextLevel: 100,
            totalXP: 0,
            maxWeight: parseInt(initialWeight) || 0,
            maxReps: parseInt(initialReps) || 0,
            maxSets: 0,
            lastPerformed: null,
            streak: 0
        };

        onAdd(newExercise);
        handleClose();
    };

    const handleClose = () => {
        setName('');
        setCategory('');
        setInitialWeight('');
        setInitialReps('');
        onClose();
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={handleClose}
        >
            <View style={styles.overlay}>
                <View style={[baseStyles.gradientCard, styles.modal]}>
                    <Text style={[baseStyles.header, styles.title]}>
                        Novo Exercício
                    </Text>

                    <ScrollView 
                        style={styles.form} 
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.formContent}
                    >
                        <View style={styles.inputGroup}>
                            <Text style={[baseStyles.bodyText, styles.label]}>
                                Nome do Exercício
                            </Text>
                            <TextInput
                                style={[baseStyles.input, styles.textInput]}
                                value={name}
                                onChangeText={setName}
                                placeholder="Ex: Supino Reto"
                                placeholderTextColor="#6B7280"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[baseStyles.bodyText, styles.label]}>
                                Categoria
                            </Text>
                            <TextInput
                                style={[baseStyles.input, styles.textInput]}
                                value={category}
                                onChangeText={setCategory}
                                placeholder="Ex: Peito, Pernas, Costas"
                                placeholderTextColor="#6B7280"
                            />
                        </View>

                        <View style={styles.row}>
                            <View style={[styles.inputGroup, styles.halfWidth]}>
                                <Text style={[baseStyles.bodyText, styles.label]}>
                                    Peso Inicial (kg)
                                </Text>
                                <TextInput
                                    style={[baseStyles.input, styles.textInput]}
                                    value={initialWeight}
                                    onChangeText={setInitialWeight}
                                    placeholder="0"
                                    placeholderTextColor="#6B7280"
                                    keyboardType="numeric"
                                />
                            </View>

                            <View style={[styles.inputGroup, styles.halfWidth]}>
                                <Text style={[baseStyles.bodyText, styles.label]}>
                                    Repetições Iniciais
                                </Text>
                                <TextInput
                                    style={[baseStyles.input, styles.textInput]}
                                    value={initialReps}
                                    onChangeText={setInitialReps}
                                    placeholder="0"
                                    placeholderTextColor="#6B7280"
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>

                        <View style={styles.infoBox}>
                            <Text style={[baseStyles.captionText, styles.infoText]}>
                                O exercício começará no nível 1 com 0 XP. Complete treinos para ganhar XP e subir de nível.
                            </Text>
                        </View>
                    </ScrollView>

                    <View style={styles.buttons}>
                        <TouchableOpacity
                            style={[baseStyles.secondaryButton, styles.cancelButton]}
                            onPress={handleClose}
                        >
                            <Text style={baseStyles.secondaryButtonText}>
                                Cancelar
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[baseStyles.modernButton, styles.addButton]}
                            onPress={handleAdd}
                        >
                            <Text style={baseStyles.buttonText}>
                                Adicionar
                            </Text>
                        </TouchableOpacity>
                    </View>
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
        padding: 24,
    },
    title: {
        textAlign: 'center',
        marginBottom: 24,
        fontSize: 20,
    },
    form: {
        marginBottom: 24,
    },
    formContent: {
        paddingBottom: 8,
    },
    inputGroup: {
        marginBottom: 20,
    },
    halfWidth: {
        flex: 1,
        marginRight: 12,
    },
    label: {
        marginBottom: 8,
        fontWeight: '600',
        fontSize: 14,
        color: '#E5E7EB',
    },
    textInput: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    infoBox: {
        backgroundColor: '#2A2A2A',
        borderRadius: 12,
        padding: 16,
        marginTop: 8,
        borderWidth: 1,
        borderColor: '#3A3A3A',
    },
    infoText: {
        textAlign: 'center',
        lineHeight: 18,
        color: '#9CA3AF',
        fontSize: 13,
    },
    buttons: {
        flexDirection: 'row',
        gap: 12,
    },
    cancelButton: {
        flex: 1,
    },
    addButton: {
        flex: 1,
    },
});
