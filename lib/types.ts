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
    photoUrl?: string;
    selectedWeapon?: WeaponType;
    hasPhoto: boolean;
    hasWeapon: boolean;
    // NEW - from user registration
    consentFlags?: {
        agreeTerms: boolean;
        agreeEsign: boolean;
        agreeEmail: boolean;
    };
    signatureMeta?: {
        timestamp: string;
        ip: string;
        termsVersion: string;
        consentFlags?: {
            agreeTerms: boolean;
            agreeEsign: boolean;
            agreeEmail: boolean;
        };
    };
}

export type PlayerColor = 'red' | 'blue' | 'yellow' | 'green' | 'purple' | 'orange';

export type WeaponType = 'assault-rifle' | 'submachine-gun' | 'dual-pistols' | 'shotgun' | 'sniper-rifle';

export interface Weapon {
    id: WeaponType;
    name: string;
    nameJp: string;
    maxCount: number;
    currentCount: number;
    isRequired?: boolean;
}

export interface Team {
    sessionCode: string;
    teamName: string;
    players: Player[];
    createdAt: string;
    maxPlayers?: number;
    // NEW - from user registration
    storeId: string;
    selectedGame: string;
    currentStep?: string;
}

export interface SessionHistory {
    sessionCode: string;
    teamName: string;
    playerCount: number;
    createdAt: string;
    storeId: string;
    selectedGame: string;
}

export interface AppState {
    currentTeam?: Team;
    sessionHistory: SessionHistory[];
    currentStep: StaffStep;
    selectedPlayer?: Player;
    weaponInventory: Weapon[];

    // Actions
    setCurrentStep: (step: StaffStep) => void;
    loadTeamBySessionCode: (sessionCode: string) => Promise<boolean>;
    addToHistory: (session: SessionHistory) => void;
    setSelectedPlayer: (player: Player) => void;
    updatePlayerPhoto: (playerId: string, photoUrl: string) => void;
    updatePlayerWeapon: (playerId: string, weapon: WeaponType) => void;
    getAvailableWeapons: () => Weapon[];
    resetSession: () => void;
}

export type StaffStep =
    | 'session-input'
    | 'player-selection'
    | 'photo-capture'
    | 'weapon-selection'
    | 'completion';
