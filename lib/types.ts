export interface Player {
    id: string;
    name: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    gender: 'male' | 'female' | 'other' | 'prefer-not-to-say';
    color: PlayerColor;
    signature?: string;
    agreedToTerms: boolean;
}

export type PlayerColor = 'red' | 'light-blue' | 'yellow' | 'green' | 'purple' | 'orange';

export interface Team {
    sessionCode: string;
    teamName: string;
    players: Player[];
    maxPlayers: number;
    currentStep: AppStep;
    currentPlayerId?: string;
    storeId: string;
    selectedGame: string;
}

export type AppStep =
    | 'welcome'
    | 'game-selection'
    | 'session-code'
    | 'user-details'
    | 'confirmation'
    | 'terms'
    | 'team-name'
    | 'completion';

export interface AppState {
    team: Team;
    currentPlayer: Partial<Player>;

    // Actions
    initializeSession: () => void;
    setCurrentStep: (step: AppStep) => void;
    updateCurrentPlayer: (player: Partial<Player>) => void;
    confirmCurrentPlayer: () => void;
    setTeamName: (name: string) => void;
    addNewPlayer: () => void;
    completeRegistration: () => void;
    resetToTop: () => void;
}
