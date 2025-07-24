// staff-store.ts
import { create } from 'zustand';
import { AppState, Team, Player, SessionHistory, Weapon, WeaponType } from './types';
import {
    loadTeamFromFirebase,
    updateTeamStaffData,
    getSessionHistory,
} from './firebase-service';
import { db } from './firebase';
import { doc, updateDoc } from 'firebase/firestore';

// ------------------------------------------------------------------
// 1.  Weapons inventory (unchanged)
// ------------------------------------------------------------------
const initialWeapons: Weapon[] = [
    {
        id: 'assault-rifle',
        name: 'Assault Rifle',
        nameJp: 'アサルトライフル',
        maxCount: 2,
        currentCount: 2,
    },
    {
        id: 'submachine-gun',
        name: 'Submachine Gun',
        nameJp: 'サブマシンガン',
        maxCount: 2,
        currentCount: 2,
    },
    {
        id: 'dual-pistols',
        name: 'Dual Pistols',
        nameJp: '二丁拳銃',
        maxCount: 2,
        currentCount: 2,
        isRequired: true,
    },
    {
        id: 'shotgun',
        name: 'Shotgun',
        nameJp: 'ショットガン',
        maxCount: 2,
        currentCount: 2,
    },
    {
        id: 'sniper-rifle',
        name: 'Sniper Rifle',
        nameJp: 'スナイパーライフル',
        maxCount: 2,
        currentCount: 2,
    },
];

const log = (fn: string, ...args: any[]) =>
    console.log(`[staff-store] ${fn}`, ...args);

const sanitize = (obj: any): any =>
    JSON.parse(JSON.stringify(obj, (_, v) => (v === undefined ? null : v)));
// ------------------------------------------------------------------
// 2.  Store definition
// ------------------------------------------------------------------
export const useStaffStore = create<AppState>((set, get) => ({
    currentTeam: undefined,
    sessionHistory: [], // <- starts empty, populated by listener
    currentStep: 'session-input',
    selectedPlayer: null,
    weaponInventory: initialWeapons,

    setCurrentStep: (step) => {
        log('setCurrentStep', step);
        set({ currentStep: step });
    },

    listenToSessionHistory: (storeId) => {
        log('listenToSessionHistory', storeId);
        getSessionHistory(storeId).then((history) =>
            set({ sessionHistory: history })
        );
    },

    loadTeamBySessionCode: async (sessionCode) => {
        log('loadTeamBySessionCode', sessionCode);
        try {
            const team = await loadTeamFromFirebase(sessionCode);
            if (team) {
                const staffPlayers = team.players.map((p) => ({
                    ...p,
                }));
                const staffTeam = { ...team, players: staffPlayers };
                set({ currentTeam: staffTeam });
                return true;
            }
            return false;
        } catch (e) {
            log('loadTeamBySessionCode:error', e);
            return false;
        }
    },

    addToHistory: (session) => {
        log('addToHistory', session);
        set((s) => ({
            sessionHistory: [session, ...s.sessionHistory.slice(0, 9)],
        }));
    },

    setSelectedPlayer: (player) => {
        log('setSelectedPlayer', player);
        set({ selectedPlayer: player });
    },

    updatePlayerPhoto: async (playerId: string, photoUrl: string) => {
        const { currentTeam } = get();
        if (!currentTeam) return;

        // 1. Update local state
        const updatedPlayers = currentTeam.players.map((p) =>
            p.id === playerId ? { ...p, photoUrl, hasPhoto: true } : p
        );
        set({ currentTeam: { ...currentTeam, players: updatedPlayers } });

        // 2. Write to sub-collection
        try {
            const playerRef = doc(db, 'teams', currentTeam.sessionCode, 'players', playerId);
            await updateDoc(playerRef, { photoUrl, hasPhoto: true });
        } catch (e) {
            console.error('updatePlayerPhoto:error', e);
        }
    },

    updatePlayerWeapon: async (playerId, weapon) => {
        const { currentTeam, weaponInventory } = get();
        if (!currentTeam) return;

        // 1. Update local state
        const updatedInventory = weaponInventory.map((w) =>
            w.id === weapon
                ? { ...w, currentCount: Math.max(0, w.currentCount - 1) }
                : w
        );
        const updatedPlayers = currentTeam.players.map((p) =>
            p.id === playerId
                ? { ...p, selectedWeapon: weapon, hasWeapon: true }
                : p
        );
        set({
            currentTeam: { ...currentTeam, players: updatedPlayers },
            weaponInventory: updatedInventory,
        });
        try {
            const playerRef = doc(db, 'teams', currentTeam.sessionCode, 'players', playerId);
            await updateDoc(playerRef, { selectedWeapon: weapon, hasWeapon: true });
        } catch (e) {
            console.error('updatePlayerWeapon:error', e);
        }

    },

    getAvailableWeapons: () => {
        log('getAvailableWeapons');
        const state = get();
        if (!state.currentTeam) return state.weaponInventory;

        const withoutDual = state.currentTeam.players.filter(
            (p) => p.selectedWeapon && p.selectedWeapon !== 'dual-pistols'
        ).length;

        return state.weaponInventory.map((w) =>
            withoutDual >= 5 && w.id !== 'dual-pistols'
                ? { ...w, currentCount: 0 }
                : w
        );
    },

    resetSession: () => {
        log('resetSession');
        set({
            currentTeam: undefined,
            selectedPlayer: undefined,
            currentStep: 'session-input',
            weaponInventory: initialWeapons.map((w) => ({
                ...w,
                currentCount: w.maxCount,
            })),
        });
    },

}));
