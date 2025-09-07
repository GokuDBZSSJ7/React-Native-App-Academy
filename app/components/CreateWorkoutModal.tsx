import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    Modal, 
    StyleSheet, 
    ScrollView,
    Alert
} from 'react-native';
import { baseStyles } from '../styles/mainStyle';
import { Exercise, Workout } from '../types';

interface CreateWorkoutModalProps {
    visible: boolean;
    onClose: () => void;
    onCreate: (workout: Omit<Workout, 'id' | 'createdAt'>) => void;
    exercises: Exercise[];
}

export const CreateWorkoutModal: React.FC<CreateWorkoutModalProps> = ({ 
    visible, 
    onClose, 
    onCreate, 
    exercises 
}) => {
    const [workoutName, setWorkoutName] = useState('');
    const [selectedDay, setSelectedDay] = useState(1); // Segunda-feira por padrão
    const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
    const [exerciseConfigs, setExerciseConfigs] = useState<Record<string, { sets: number; reps: number; weight: number; restTime: number }>>({});

    const daysOfWeek = [
        { value: 0, label: 'Domingo' },
        { value: 1, label: 'Segunda-feira' },
        { value: 2, label: 'Terça-feira' },
        { value: 3, label: 'Quarta-feira' },
        { value: 4, label: 'Quinta-feira' },
        { value: 5, label: 'Sexta-feira' },
        { value: 6, label: 'Sábado' }
    ];

    const handleCreate = () => {
        if (!workoutName.trim()) {
            Alert.alert('Erro', 'Digite um nome para o treino');
            return;
        }

        if (selectedExercises.length === 0) {
            Alert.alert('Erro', 'Selecione pelo menos um exercício');
            return;
        }

        // Criar configurações padrão para exercícios não configurados
        const finalExerciseConfigs = selectedExercises.map(exerciseId => {
            const config = exerciseConfigs[exerciseId] || { sets: 3, reps: 10, weight: 0, restTime: 90 };
            return {
                exerciseId,
                sets: config.sets,
                reps: config.reps,
                weight: config.weight,
                restTime: config.restTime
            };
        });

        const newWorkout: Omit<Workout, 'id' | 'createdAt'> = {
            name: workoutName.trim(),
            dayOfWeek: selectedDay,
            exercises: finalExerciseConfigs,
            isActive: true
        };

        onCreate(newWorkout);
        handleClose();
    };

    const handleClose = () => {
        setWorkoutName('');
        setSelectedDay(1);
        setSelectedExercises([]);
        setExerciseConfigs({});
        onClose();
    };

    const toggleExercise = (exerciseId: string) => {
        if (selectedExercises.includes(exerciseId)) {
            setSelectedExercises(selectedExercises.filter(id => id !== exerciseId));
            // Remover configuração do exercício
            const newConfigs = { ...exerciseConfigs };
            delete newConfigs[exerciseId];
            setExerciseConfigs(newConfigs);
        } else {
            setSelectedExercises([...selectedExercises, exerciseId]);
            // Adicionar configuração padrão
            setExerciseConfigs({
                ...exerciseConfigs,
                [exerciseId]: { sets: 3, reps: 10, weight: 0, restTime: 90 }
            });
        }
    };

    const updateExerciseConfig = (exerciseId: string, field: string, value: string) => {
        const numValue = parseInt(value) || 0;
        setExerciseConfigs({
            ...exerciseConfigs,
            [exerciseId]: {
                ...exerciseConfigs[exerciseId],
                [field]: numValue
            }
        });
    };

    const isExerciseSelected = (exerciseId: string) => selectedExercises.includes(exerciseId);

    return (
        <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={handleClose}>
            <View style={styles.overlay}>
                <View style={[baseStyles.gradientCard, styles.modal]}>
                    <Text style={[baseStyles.header, styles.title]}>Criar Novo Treino</Text>
                    
                    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                        {/* Nome do Treino */}
                        <View style={styles.inputGroup}>
                            <Text style={[baseStyles.bodyText, styles.label]}>Nome do Treino</Text>
                            <TextInput
                                style={[baseStyles.input, styles.textInput]}
                                value={workoutName}
                                onChangeText={setWorkoutName}
                                placeholder="Ex: Treino A - Push"
                                placeholderTextColor="#6B7280"
                            />
                        </View>

                        {/* Dia da Semana */}
                        <View style={styles.inputGroup}>
                            <Text style={[baseStyles.bodyText, styles.label]}>Dia da Semana</Text>
                            <View style={styles.daySelector}>
                                {daysOfWeek.map(day => (
                                    <TouchableOpacity
                                        key={day.value}
                                        style={[
                                            styles.dayButton,
                                            selectedDay === day.value && styles.selectedDayButton
                                        ]}
                                        onPress={() => setSelectedDay(day.value)}
                                    >
                                        <Text style={[
                                            styles.dayButtonText,
                                            selectedDay === day.value && styles.selectedDayButtonText
                                        ]}>
                                            {day.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Seleção de Exercícios */}
                        <View style={styles.inputGroup}>
                            <Text style={[baseStyles.bodyText, styles.label]}>
                                Exercícios ({selectedExercises.length} selecionados)
                            </Text>
                            
                            <View style={styles.exercisesList}>
                                {exercises.map(exercise => (
                                    <View key={exercise.id} style={styles.exerciseItem}>
                                        <TouchableOpacity
                                            style={[
                                                styles.exerciseSelector,
                                                isExerciseSelected(exercise.id) && styles.exerciseSelected
                                            ]}
                                            onPress={() => toggleExercise(exercise.id)}
                                        >
                                            <Text style={[
                                                styles.exerciseName,
                                                isExerciseSelected(exercise.id) && styles.exerciseNameSelected
                                            ]}>
                                                {exercise.name}
                                            </Text>
                                            <Text style={[
                                                styles.exerciseCategory,
                                                isExerciseSelected(exercise.id) && styles.exerciseCategorySelected
                                            ]}>
                                                {exercise.category}
                                            </Text>
                                        </TouchableOpacity>

                                        {/* Configuração do exercício se selecionado */}
                                        {isExerciseSelected(exercise.id) && (
                                            <View style={styles.exerciseConfig}>
                                                <View style={styles.configRow}>
                                                    <View style={styles.configItem}>
                                                        <Text style={styles.configLabel}>Sets</Text>
                                                        <TextInput
                                                            style={styles.configInput}
                                                            value={exerciseConfigs[exercise.id]?.sets?.toString() || '3'}
                                                            onChangeText={(value) => updateExerciseConfig(exercise.id, 'sets', value)}
                                                            keyboardType="numeric"
                                                            placeholder="3"
                                                            placeholderTextColor="#6B7280"
                                                        />
                                                    </View>
                                                    
                                                    <View style={styles.configItem}>
                                                        <Text style={styles.configLabel}>Reps</Text>
                                                        <TextInput
                                                            style={styles.configInput}
                                                            value={exerciseConfigs[exercise.id]?.reps?.toString() || '10'}
                                                            onChangeText={(value) => updateExerciseConfig(exercise.id, 'reps', value)}
                                                            keyboardType="numeric"
                                                            placeholder="10"
                                                            placeholderTextColor="#6B7280"
                                                        />
                                                    </View>
                                                    
                                                    <View style={styles.configItem}>
                                                        <Text style={styles.configLabel}>Peso (kg)</Text>
                                                        <TextInput
                                                            style={styles.configInput}
                                                            value={exerciseConfigs[exercise.id]?.weight?.toString() || '0'}
                                                            onChangeText={(value) => updateExerciseConfig(exercise.id, 'weight', value)}
                                                            keyboardType="numeric"
                                                            placeholder="0"
                                                            placeholderTextColor="#6B7280"
                                                        />
                                                    </View>
                                                    
                                                    <View style={styles.configItem}>
                                                        <Text style={styles.configLabel}>Descanso (s)</Text>
                                                        <TextInput
                                                            style={styles.configInput}
                                                            value={exerciseConfigs[exercise.id]?.restTime?.toString() || '90'}
                                                            onChangeText={(value) => updateExerciseConfig(exercise.id, 'restTime', value)}
                                                            keyboardType="numeric"
                                                            placeholder="90"
                                                            placeholderTextColor="#6B7280"
                                                        />
                                                    </View>
                                                </View>
                                            </View>
                                        )}
                                    </View>
                                ))}
                            </View>
                        </View>

                        {/* Informações */}
                        <View style={styles.infoBox}>
                            <Text style={[baseStyles.captionText, styles.infoText]}>
                                💡 Dica: Configure sets, repetições e descanso para cada exercício. 
                                O peso pode ser ajustado durante o treino.
                            </Text>
                        </View>
                    </ScrollView>

                    {/* Botões */}
                    <View style={styles.buttons}>
                        <TouchableOpacity
                            style={[baseStyles.secondaryButton, styles.cancelButton]}
                            onPress={handleClose}
                        >
                            <Text style={baseStyles.secondaryButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            style={[baseStyles.modernButton, styles.createButton]}
                            onPress={handleCreate}
                        >
                            <Text style={baseStyles.buttonText}>Criar Treino</Text>
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
        maxHeight: '90%',
        padding: 24,
    },
    title: {
        textAlign: 'center',
        marginBottom: 24,
        fontSize: 20,
    },
    content: {
        marginBottom: 24,
    },
    inputGroup: {
        marginBottom: 24,
    },
    label: {
        marginBottom: 12,
        fontWeight: '600',
        fontSize: 14,
        color: '#E5E7EB',
    },
    textInput: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    daySelector: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    dayButton: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#3A3A3A',
        backgroundColor: '#2A2A2A',
        minWidth: 80,
        alignItems: 'center',
    },
    selectedDayButton: {
        backgroundColor: '#3B82F6',
        borderColor: '#3B82F6',
    },
    dayButtonText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#9CA3AF',
    },
    selectedDayButtonText: {
        color: '#FFFFFF',
    },
    exercisesList: {
        gap: 12,
    },
    exerciseItem: {
        borderWidth: 1,
        borderColor: '#3A3A3A',
        borderRadius: 12,
        overflow: 'hidden',
    },
    exerciseSelector: {
        padding: 16,
        backgroundColor: '#2A2A2A',
    },
    exerciseSelected: {
        backgroundColor: '#1A1A1A',
        borderBottomWidth: 1,
        borderBottomColor: '#3A3A3A',
    },
    exerciseName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#E5E7EB',
        marginBottom: 4,
    },
    exerciseNameSelected: {
        color: '#3B82F6',
    },
    exerciseCategory: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    exerciseCategorySelected: {
        color: '#6B7280',
    },
    exerciseConfig: {
        padding: 16,
        backgroundColor: '#1A1A1A',
    },
    configRow: {
        flexDirection: 'row',
        gap: 12,
    },
    configItem: {
        flex: 1,
        alignItems: 'center',
    },
    configLabel: {
        fontSize: 10,
        color: '#9CA3AF',
        marginBottom: 6,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    configInput: {
        backgroundColor: '#2A2A2A',
        borderWidth: 1,
        borderColor: '#3A3A3A',
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 6,
        fontSize: 12,
        color: '#E5E7EB',
        textAlign: 'center',
        minWidth: 50,
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
    createButton: {
        flex: 1,
    },
});
