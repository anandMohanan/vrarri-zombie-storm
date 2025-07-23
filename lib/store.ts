// lib/store.ts
import { create } from 'zustand';
import { AppState, Team, Player, PlayerColor } from './types';
import {
    saveCompleteTeamToFirebase,
    logRegistrationComplete,
    uploadSignatureToStorage,
} from './firebase-service';

const PLAYER_COLORS: PlayerColor[] = [
    'red',
    'light-blue',
    'yellow',
    'green',
    'purple',
    'orange',
];

const generateSessionCode = (storeId: string): string => {
    const randomCode = Math.floor(10000 + Math.random() * 90000).toString();
    return `${storeId.toUpperCase()}-${randomCode}`;
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
    selectedGame: '',
};

export const useAppStore = create<AppState>((set, get) => ({
    team: initialTeam,
    currentPlayer: {},

    /* ----------  NEW  ---------- */
    // Helper to fetch IP once (lightweight, no backend)
    _fetchIp: async (): Promise<string> => {
        try {
            const res = await fetch('https://api.ipify.org?format=json');
            const data = await res.json();
            return data.ip || 'unknown';
        } catch {
            return 'unknown';
        }
    },
    /* ----------  END NEW  ---------- */

    initializeSession: (storeId: string) => {
        const sessionCode = generateSessionCode(storeId);
        set({
            team: { ...initialTeam, sessionCode, storeId },
            currentPlayer: createNewPlayer(0),
        });
    },

    setSelectedGame: (game: string) =>
        set((state) => ({
            team: { ...state.team, selectedGame: game },
        })),

    setCurrentStep: (step) =>
        set((state) => ({
            team: { ...state.team, currentStep: step },
        })),

    updateCurrentPlayer: (playerData) =>
        set((state) => ({
            currentPlayer: { ...state.currentPlayer, ...playerData },
        })),

    confirmCurrentPlayer: async () => {
        const { team, currentPlayer, _fetchIp } = get();

        if (!currentPlayer.id) return;

        let signatureUrl = '';

        // 1. Upload signature PNG to Firebase Storage
        if (currentPlayer.signature && currentPlayer.signature.startsWith('data:image')) {
            try {
                signatureUrl = await uploadSignatureToStorage(
                    team.sessionCode,
                    currentPlayer.id,
                    currentPlayer.signature
                );
            } catch (err) {
                console.error('Signature upload failed:', err);
            }
        }

        // 2. Build consent metadata
        const ip = await _fetchIp();
        const signatureMeta = {
            timestamp: new Date().toISOString(),
            ip,
            termsVersion: 'v1.0', // bump whenever terms text changes
            consentFlags: currentPlayer.consentFlags,
        };

        // 3. Create final Player object
        const newPlayer: Player = {
            id: currentPlayer.id,
            name: currentPlayer.name || '',
            email: currentPlayer.email || '',
            phone: currentPlayer.phone || '',
            dateOfBirth: currentPlayer.dateOfBirth || '',
            gender: currentPlayer.gender || 'prefer-not-to-say',
            color: currentPlayer.color || 'red',
            signature: signatureUrl,
            agreedToTerms: true,
            signatureMeta,
        };

        set({
            team: {
                ...team,
                players: [...team.players, newPlayer],
            },
            currentPlayer: {},
        });
    },

    setTeamName: (name) =>
        set((state) => ({
            team: { ...state.team, teamName: name },
        })),

    addNewPlayer: () => {
        const { team } = get();
        const playerIndex = team.players.length;
        if (playerIndex < team.maxPlayers) {
            set({ currentPlayer: createNewPlayer(playerIndex) });
        }
    },

    completeRegistration: async () => {
        const { team } = get();
        try {
            await saveCompleteTeamToFirebase(team);
            await logRegistrationComplete(team);
            set((state) => ({
                team: { ...state.team, currentStep: 'completion' },
            }));
        } catch (error) {
            console.error('Firebase save failed:', error);
            alert('Registration completed locally. Please contact staff if online save failed.');
            set((state) => ({
                team: { ...state.team, currentStep: 'completion' },
            }));
        }
    },

    resetToTop: () =>
        set({
            team: initialTeam,
            currentPlayer: {},
        }),
}));
