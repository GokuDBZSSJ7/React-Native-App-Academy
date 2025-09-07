import React from 'react';
import { 
    View, 
    Text, 
    Modal, 
    StyleSheet, 
    ScrollView,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import { baseStyles } from '../styles/mainStyle';
import { Achievement } from '../utils/achievements';
import { getAchievementsByCategory, getAchievementStats } from '../utils/achievements';

interface AchievementsModalProps {
    visible: boolean;
    onClose: () => void;
    achievements: Achievement[];
}

const { width, height } = Dimensions.get('window');

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
    visible,
    onClose,
    achievements
}) => {
    const categorizedAchievements = getAchievementsByCategory(achievements);
    const stats = getAchievementStats(achievements);

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'first_time': return '🎯';
            case 'progress': return '📈';
            case 'streak': return '🔥';
            case 'milestone': return '💎';
            case 'special': return '⭐';
            default: return '🏆';
        }
    };

    const getCategoryTitle = (category: string) => {
        switch (category) {
            case 'first_time': return 'Primeira Vez';
            case 'progress': return 'Progresso';
            case 'streak': return 'Sequência';
            case 'milestone': return 'Milestones';
            case 'special': return 'Especiais';
            default: return category;
        }
    };

    const getCategoryDescription = (category: string) => {
        switch (category) {
            case 'first_time': return 'Conquistas para marcos iniciais';
            case 'progress': return 'Conquistas por consistência';
            case 'streak': return 'Conquistas por sequência de treinos';
            case 'milestone': return 'Conquistas por metas de XP';
            case 'special': return 'Conquistas especiais e únicas';
            default: return 'Conquistas gerais';
        }
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
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={[baseStyles.header, styles.title]}>
                            Conquistas
                        </Text>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={onClose}
                        >
                            <Text style={styles.closeButtonText}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Estatísticas Gerais */}
                    <View style={styles.statsContainer}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{stats.unlocked}</Text>
                            <Text style={styles.statLabel}>Desbloqueadas</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{stats.locked}</Text>
                            <Text style={styles.statLabel}>Bloqueadas</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{stats.total}</Text>
                            <Text style={styles.statLabel}>Total</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{stats.completionRate}%</Text>
                            <Text style={styles.statLabel}>Completado</Text>
                        </View>
                    </View>

                    {/* Barra de Progresso Geral */}
                    <View style={styles.progressContainer}>
                        <View style={styles.progressBar}>
                            <View 
                                style={[
                                    styles.progressFill, 
                                    { width: `${stats.completionRate}%` }
                                ]} 
                            />
                        </View>
                        <Text style={styles.progressText}>
                            {stats.unlocked} de {stats.total} conquistas desbloqueadas
                        </Text>
                    </View>

                    {/* Lista de Conquistas por Categoria */}
                    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                        {Object.entries(categorizedAchievements).map(([category, categoryAchievements]) => (
                            <View key={category} style={styles.categorySection}>
                                <View style={styles.categoryHeader}>
                                    <Text style={styles.categoryIcon}>
                                        {getCategoryIcon(category)}
                                    </Text>
                                    <View style={styles.categoryInfo}>
                                        <Text style={styles.categoryTitle}>
                                            {getCategoryTitle(category)}
                                        </Text>
                                        <Text style={styles.categoryDescription}>
                                            {getCategoryDescription(category)}
                                        </Text>
                                    </View>
                                    <View style={styles.categoryCount}>
                                        <Text style={styles.categoryCountText}>
                                            {categoryAchievements.filter(a => a.unlocked).length}/{categoryAchievements.length}
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.achievementsList}>
                                    {categoryAchievements.map((achievement) => (
                                        <AchievementCard 
                                            key={achievement.id} 
                                            achievement={achievement} 
                                        />
                                    ))}
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

// Componente para cada conquista individual
const AchievementCard: React.FC<{ achievement: Achievement }> = ({ achievement }) => {
    const isUnlocked = achievement.unlocked;
    
    return (
        <View style={[
            styles.achievementCard,
            isUnlocked ? styles.achievementUnlocked : styles.achievementLocked
        ]}>
            <View style={styles.achievementHeader}>
                <View style={styles.achievementIconContainer}>
                    <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                    {isUnlocked && (
                        <View style={styles.unlockBadge}>
                            <Text style={styles.unlockBadgeText}>✓</Text>
                        </View>
                    )}
                </View>
                
                <View style={styles.achievementInfo}>
                    <Text style={[
                        styles.achievementName,
                        isUnlocked ? styles.achievementNameUnlocked : styles.achievementNameLocked
                    ]}>
                        {achievement.name}
                    </Text>
                    <Text style={[
                        styles.achievementDescription,
                        isUnlocked ? styles.achievementDescriptionUnlocked : styles.achievementDescriptionLocked
                    ]}>
                        {achievement.description}
                    </Text>
                </View>

                <View style={styles.achievementStatus}>
                    {isUnlocked ? (
                        <Text style={styles.unlockedText}>Desbloqueada</Text>
                    ) : (
                        <Text style={styles.lockedText}>Bloqueada</Text>
                    )}
                </View>
            </View>

            {/* Barra de progresso para conquistas com progresso */}
            {achievement.maxProgress && (
                <View style={styles.progressSection}>
                    <View style={styles.progressBar}>
                        <View 
                            style={[
                                styles.progressFill, 
                                { width: `${(achievement.progress || 0) / achievement.maxProgress * 100}%` }
                            ]} 
                        />
                    </View>
                    <Text style={styles.progressText}>
                        {achievement.progress || 0}/{achievement.maxProgress}
                    </Text>
                </View>
            )}

            {/* Data de desbloqueio */}
            {isUnlocked && achievement.unlockedAt && (
                <View style={styles.unlockInfo}>
                    <Text style={styles.unlockDate}>
                        Desbloqueada em {achievement.unlockedAt.toLocaleDateString('pt-BR')}
                    </Text>
                </View>
            )}
        </View>
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
        height: '90%',
        padding: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#2A2A2A',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#3A3A3A',
    },
    closeButtonText: {
        fontSize: 18,
        color: '#9CA3AF',
        fontWeight: '600',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        paddingHorizontal: 8,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statValue: {
        fontSize: 20,
        fontWeight: '800',
        color: '#3B82F6',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 7,
        color: '#9CA3AF',
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        fontWeight: '500',
    },
    progressContainer: {
        marginBottom: 24,
    },
    progressBar: {
        height: 8,
        backgroundColor: '#2A2A2A',
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 8,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#10B981',
        borderRadius: 4,
    },
    progressText: {
        fontSize: 12,
        color: '#9CA3AF',
        textAlign: 'center',
        fontWeight: '500',
    },
    content: {
        flex: 1,
    },
    categorySection: {
        marginBottom: 24,
    },
    categoryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        paddingHorizontal: 8,
    },
    categoryIcon: {
        fontSize: 24,
        marginRight: 12,
    },
    categoryInfo: {
        flex: 1,
    },
    categoryTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#8B5CF6',
        marginBottom: 2,
    },
    categoryDescription: {
        fontSize: 12,
        color: '#9CA3AF',
        lineHeight: 16,
    },
    categoryCount: {
        backgroundColor: '#2A2A2A',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#3A3A3A',
    },
    categoryCountText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#10B981',
    },
    achievementsList: {
        gap: 12,
    },
    achievementCard: {
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
    },
    achievementUnlocked: {
        backgroundColor: '#1A1A1A',
        borderColor: '#10B981',
    },
    achievementLocked: {
        backgroundColor: '#2A2A2A',
        borderColor: '#3A3A3A',
        opacity: 0.7,
    },
    achievementHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    achievementIconContainer: {
        position: 'relative',
        marginRight: 16,
    },
    achievementIcon: {
        fontSize: 32,
    },
    unlockBadge: {
        position: 'absolute',
        top: -4,
        right: -4,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#10B981',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#1A1A1A',
    },
    unlockBadgeText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    achievementInfo: {
        flex: 1,
    },
    achievementName: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 4,
    },
    achievementNameUnlocked: {
        color: '#FFFFFF',
    },
    achievementNameLocked: {
        color: '#9CA3AF',
    },
    achievementDescription: {
        fontSize: 13,
        lineHeight: 18,
    },
    achievementDescriptionUnlocked: {
        color: '#9CA3AF',
    },
    achievementDescriptionLocked: {
        color: '#6B7280',
    },
    achievementStatus: {
        marginLeft: 8,
    },
    unlockedText: {
        fontSize: 11,
        color: '#10B981',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    lockedText: {
        fontSize: 11,
        color: '#6B7280',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    progressSection: {
        marginTop: 8,
    },
    unlockInfo: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#2A2A2A',
    },
    unlockDate: {
        fontSize: 11,
        color: '#10B981',
        textAlign: 'center',
        fontStyle: 'italic',
    },
});
