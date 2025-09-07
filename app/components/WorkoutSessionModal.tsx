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
import { calculateSetXP } from '../utils/xpSystem';

interface WorkoutSessionModalProps {
    visible: boolean;
    onClose: () => void;
    workout: Workout;
    exercises: Exercise[];
    onComplete: (sessionData: any) => void;
}

export const WorkoutSessionModal: React.FC<WorkoutSessionModalProps> = ({
    visible,
    onClose,
    workout,
    exercises,
    onComplete
}) => {
    const [sessionData, setSessionData] = useState<{[key: string]: any}>({});
    const [notes, setNotes] = useState('');

    const handleSetChange = (exerciseId: string, setIndex: number, field: string, value: string) => {
        setSessionData(prev => ({
            ...prev,
            [exerciseId]: {
                ...prev[exerciseId],
                [setIndex]: {
                    ...prev[exerciseId]?.[setIndex],
                    [field]: parseInt(value) || 0
                }
            }
        }));
    };

    const calculateTotalXP = () => {
        let totalXP = 0;
        Object.keys(sessionData).forEach(exerciseId => {
            const exercise = exercises.find(ex => ex.id === exerciseId);
            if (exercise) {
                Object.values(sessionData[exerciseId]).forEach((set: any) => {
                    if (set.weight && set.reps) {
                        totalXP += calculateSetXP(set.weight, set.reps, exercise.currentLevel, exercise.streak);
                    }
                });
            }
        });
        return totalXP;
    };

    const handleComplete = () => {
        const totalXP = calculateTotalXP();
        if (totalXP === 0) {
            Alert.alert('Erro', 'Complete pelo menos um set para finalizar o treino');
            return;
        }

        const sessionInfo = {
            workoutId: workout.id,
            exercises: Object.keys(sessionData).map(exerciseId => ({
                exerciseId,
                sets: Object.values(sessionData[exerciseId])
            })),
            totalXP,
            notes,
            date: new Date()
        };

        onComplete(sessionInfo);
        onClose();
        setSessionData({});
        setNotes('');
    };

    const renderExerciseSets = (exercise: Exercise) => {
        const workoutExercise = workout.exercises.find(we => we.exerciseId === exercise.id);
        if (!workoutExercise) return null;

        const sets = [];
        for (let i = 0; i < workoutExercise.sets; i++) {
            sets.push(
                <View key={i} style={styles.setRow}>
                    <Text style={styles.setNumber}>Set {i + 1}</Text>
                    
                    <View style={styles.setInputs}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Peso (kg)</Text>
                            <TextInput
                                style={[baseStyles.input, styles.setInput]}
                                value={sessionData[exercise.id]?.[i]?.weight?.toString() || ''}
                                onChangeText={(value) => handleSetChange(exercise.id, i, 'weight', value)}
                                placeholder="0"
                                placeholderTextColor="#6B7280"
                                keyboardType="numeric"
                            />
                        </View>
                        
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Reps</Text>
                            <TextInput
                                style={[baseStyles.input, styles.setInput]}
                                value={sessionData[exercise.id]?.[i]?.reps?.toString() || ''}
                                onChangeText={(value) => handleSetChange(exercise.id, i, 'reps', value)}
                                placeholder="0"
                                placeholderTextColor="#6B7280"
                                keyboardType="numeric"
                            />
                        </View>
                    </View>
                </View>
            );
        }

        return (
            <View key={exercise.id} style={styles.exerciseSection}>
                <View style={styles.exerciseHeader}>
                    <Text style={[baseStyles.titleText, styles.exerciseName]}>
                        {exercise.name}
                    </Text>
                    <View style={[baseStyles.levelBadge, styles.levelBadge]}>
                        <Text style={[baseStyles.buttonText, styles.levelText]}>
                            Nv. {exercise.currentLevel}
                        </Text>
                    </View>
                </View>
                
                <Text style={[baseStyles.captionText, styles.exerciseInfo]}>
                    {workoutExercise.sets} séries × {workoutExercise.reps} reps
                </Text>
                
                {sets}
            </View>
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
                        {workout.name}
                    </Text>
                    
                    <Text style={[baseStyles.bodyText, styles.subtitle]}>
                        Registre seus sets para ganhar XP
                    </Text>

                    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                        {workout.exercises.map(we => {
                            const exercise = exercises.find(ex => ex.id === we.exerciseId);
                            return exercise ? renderExerciseSets(exercise) : null;
                        })}

                        <View style={styles.notesSection}>
                            <Text style={[baseStyles.bodyText, styles.notesLabel]}>
                                Observações do Treino
                            </Text>
                            <TextInput
                                style={[baseStyles.input, styles.notesInput]}
                                value={notes}
                                onChangeText={setNotes}
                                placeholder="Como foi o treino? Alguma observação?"
                                placeholderTextColor="#6B7280"
                                multiline
                                numberOfLines={3}
                            />
                        </View>

                        <View style={styles.xpPreview}>
                            <Text style={[baseStyles.bodyText, styles.xpLabel]}>
                                XP Estimado
                            </Text>
                            <Text style={[baseStyles.displayText, styles.xpValue]}>
                                {calculateTotalXP()}
                            </Text>
                        </View>
                    </ScrollView>

                    <View style={styles.buttons}>
                        <TouchableOpacity
                            style={[baseStyles.secondaryButton, styles.cancelButton]}
                            onPress={onClose}
                        >
                            <Text style={baseStyles.secondaryButtonText}>Cancelar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[baseStyles.modernButton, styles.completeButton]}
                            onPress={handleComplete}
                        >
                            <Text style={baseStyles.buttonText}>Completar Treino</Text>
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
        width: '95%',
        maxHeight: '90%',
        padding: 28,
    },
    title: {
        textAlign: 'center',
        marginBottom: 12,
    },
    subtitle: {
        textAlign: 'center',
        color: '#9CA3AF',
        marginBottom: 28,
        opacity: 0.8,
    },
    content: {
        marginBottom: 28,
    },
    exerciseSection: {
        backgroundColor: '#1A1A1A',
        borderRadius: 20,
        padding: 24,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },
    exerciseHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    exerciseName: {
        fontSize: 20,
        fontWeight: '600',
        flex: 1,
    },
    levelBadge: {
        minWidth: 70,
    },
    levelText: {
        fontSize: 12,
        fontWeight: '600',
    },
    exerciseInfo: {
        marginBottom: 20,
        color: '#9CA3AF',
        opacity: 0.8,
    },
    setRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#2A2A2A',
    },
    setNumber: {
        width: 80,
        fontSize: 16,
        fontWeight: '600',
        color: '#3B82F6',
    },
    setInputs: {
        flex: 1,
        flexDirection: 'row',
        gap: 16,
    },
    inputGroup: {
        flex: 1,
    },
    inputLabel: {
        fontSize: 12,
        color: '#9CA3AF',
        marginBottom: 8,
        fontWeight: '500',
    },
    setInput: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        textAlign: 'center',
    },
    notesSection: {
        marginBottom: 24,
    },
    notesLabel: {
        marginBottom: 12,
        fontWeight: '600',
    },
    notesInput: {
        minHeight: 100,
        textAlignVertical: 'top',
    },
    xpPreview: {
        backgroundColor: '#2A2A2A',
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#3A3A3A',
    },
    xpLabel: {
        marginBottom: 8,
        color: '#9CA3AF',
        opacity: 0.8,
    },
    xpValue: {
        fontSize: 32,
        fontWeight: '800',
        color: '#3B82F6',
    },
    buttons: {
        flexDirection: 'row',
        gap: 16,
    },
    cancelButton: {
        flex: 1,
    },
    completeButton: {
        flex: 1,
        backgroundColor: '#10B981',
    },
});
