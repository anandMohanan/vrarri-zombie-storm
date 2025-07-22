// lib/store.ts
import { create } from 'zustand';
import { AppState, Team, Player, PlayerColor } from './types';
import {
    saveCompleteTeamToFirebase,
    logRegistrationComplete,
    uploadSignatureToStorage
} from './firebase-service';

const PLAYER_COLORS: PlayerColor[] = ['red', 'light-blue', 'yellow', 'green', 'purple', 'orange'];

const generateSessionCode = (storeId: string): string => {
    const randomCode = Math.floor(10000 + Math.random() * 90000).toString();
    return `${storeId}-${randomCode}`;
};

const createNewPlayer = (index: number): Partial<Player> => ({
    id: `player-${index + 1}`,
    color: PLAYER_COLORS[index],
    agreedToTerms: false,
});

const initialTeam: Team = {
    sessionCode: '',
    teamName: '',
    players: [],
    maxPlayers: 6,
    currentStep: 'welcome',
    storeId: '',
};

export const useAppStore = create<AppState>((set, get) => ({
    team: initialTeam,
    currentPlayer: {},

    // Modified to accept storeId
    initializeSession: (storeId: string) => {
        const sessionCode = generateSessionCode(storeId); // Pass storeId to generator
        set({
            team: { ...initialTeam, sessionCode, storeId },
            currentPlayer: createNewPlayer(0),
        });
    },

    setSelectedGame: (game: string) =>
        set((state) => ({
            team: { ...state.team, selectedGame: game },
        })),

    setCurrentStep: (step) => {
        set((state) => ({
            team: { ...state.team, currentStep: step },
        }));
    },

    updateCurrentPlayer: (playerData) => {
        set((state) => ({
            currentPlayer: { ...state.currentPlayer, ...playerData },
        }));
    },

    confirmCurrentPlayer: async () => {
        const { team, currentPlayer } = get();

        if (currentPlayer.id) {
            let signatureUrl = '';

            // Upload signature to Firebase Storage if exists
            if (currentPlayer.signature && currentPlayer.signature !== '') {
                try {
                    signatureUrl = await uploadSignatureToStorage(
                        team.sessionCode,
                        currentPlayer.id,
                        currentPlayer.signature
                    );
                } catch (error) {
                    console.error('Failed to upload signature:', error);
                    // Continue without signature URL
                }
            }

            const newPlayer: Player = {
                id: currentPlayer.id,
                name: currentPlayer.name || '',
                email: currentPlayer.email || '',
                phone: currentPlayer.phone || '',
                dateOfBirth: currentPlayer.dateOfBirth || '',
                gender: currentPlayer.gender || 'prefer-not-to-say',
                color: currentPlayer.color || 'red',
                signature: signatureUrl, // Store URL instead of data URL
                agreedToTerms: currentPlayer.agreedToTerms || false,
            };

            set({
                team: {
                    ...team,
                    players: [...team.players, newPlayer],
                },
                currentPlayer: {},
            });
        }
    },

    setTeamName: (name) => {
        set((state) => ({
            team: { ...state.team, teamName: name },
        }));
    },

    addNewPlayer: () => {
        const { team } = get();
        const playerIndex = team.players.length;

        if (playerIndex < team.maxPlayers) {
            set({
                currentPlayer: createNewPlayer(playerIndex),
            });
        }
    },

    completeRegistration: async () => {
        const { team } = get();

        try {
            // Save complete team to Firebase
            await saveCompleteTeamToFirebase(team);

            // Log registration completion
            await logRegistrationComplete(team);

            console.log('Registration completed and saved to Firebase');

            set((state) => ({
                team: { ...state.team, currentStep: 'completion' },
            }));
        } catch (error) {
            console.error('Failed to save to Firebase, but registration completed locally:', error);

            // Still proceed to completion even if Firebase fails
            set((state) => ({
                team: { ...state.team, currentStep: 'completion' },
            }));

            // Optionally show a warning to user that data wasn't saved online
            alert('Registration completed! Note: Data could not be saved online, please contact staff.');
        }
    },

    resetToTop: () => {
        set({
            team: initialTeam,
            currentPlayer: {},
        });
    },
}));
