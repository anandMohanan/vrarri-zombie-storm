import { db, storage } from './firebase';
import {
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    serverTimestamp,
    addDoc,
    updateDoc,
    query,
    orderBy,
    limit,
    onSnapshot
} from 'firebase/firestore';
import {
    ref,
    uploadBytes,
    getDownloadURL
} from 'firebase/storage';
import { Team, Player, SessionHistory } from './types';

// Helper function to convert canvas data URL to blob
const dataURLtoBlob = (dataURL: string): Blob => {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
};

// Upload signature to Firebase Storage
export const uploadSignatureToStorage = async (
    sessionCode: string,
    playerId: string,
    signatureDataURL: string
): Promise<string> => {
    try {
        // Convert data URL to blob
        const blob = dataURLtoBlob(signatureDataURL);

        // Create storage reference
        const signatureRef = ref(storage, `signatures/${sessionCode}/${playerId}.png`);

        // Upload the blob
        await uploadBytes(signatureRef, blob);

        // Get download URL
        const downloadURL = await getDownloadURL(signatureRef);

        console.log('Signature uploaded successfully:', downloadURL);
        return downloadURL;
    } catch (error) {
        console.error('Error uploading signature:', error);
        throw error;
    }
};

// Helper function to remove undefined values
const sanitizeData = (obj: any): any => {
    const sanitized: any = {};
    Object.keys(obj).forEach(key => {
        if (obj[key] !== undefined && obj[key] !== null) {
            if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
                sanitized[key] = sanitizeData(obj[key]);
            } else {
                sanitized[key] = obj[key];
            }
        }
    });
    return sanitized;
};

// Save complete team data to Firebase (only on completion)
export const saveCompleteTeamToFirebase = async (team: Team): Promise<void> => {
    try {
        const teamRef = doc(db, 'teams', team.sessionCode);

        // Save main team document
        const teamData = sanitizeData({
            sessionCode: team.sessionCode,
            teamName: team.teamName,
            playerCount: team.players.length,
            maxPlayers: team.maxPlayers,
            status: 'completed',
            createdAt: serverTimestamp(),
            completedAt: serverTimestamp(),
            storeId: team.storeId,
            selectedGame: team.selectedGame
        });

        await setDoc(teamRef, teamData);

        // Save each player as subcollection
        const playerPromises = team.players.map(player => {
            const playerRef = doc(db, 'teams', team.sessionCode, 'players', player.id);
            const playerData = sanitizeData({
                ...player,
                createdAt: serverTimestamp()
            });
            return setDoc(playerRef, playerData);
        });

        await Promise.all(playerPromises);

        console.log('Team successfully saved to Firebase');
    } catch (error) {
        console.error('Error saving complete team:', error);
        throw error;
    }
};


// Log registration completion
export const logRegistrationComplete = async (team: Team): Promise<void> => {
    try {
        await addDoc(collection(db, 'registrationLogs'), {
            sessionCode: team.sessionCode,
            teamName: team.teamName,
            playerCount: team.players.length,
            completedAt: serverTimestamp(),
            status: 'registration_completed',
            storeId: team.storeId,
            selectedGame: team.selectedGame
        });
    } catch (error) {
        console.error('Error logging registration:', error);
        throw error;
    }
};

export const loadTeamFromFirebase = async (sessionCode: string): Promise<Team | null> => {
  try {
    // 1. Load root team document
    const teamRef = doc(db, 'teams', sessionCode);
    const teamSnap = await getDoc(teamRef);

    if (!teamSnap.exists()) return null;

    const teamData = teamSnap.data();

    // 2. Load players from sub-collection
    const playersRef = collection(db, 'teams', sessionCode, 'players');
    const playersSnap = await getDocs(playersRef);

    const players: Player[] = [];
    playersSnap.forEach((doc) => {
      const p = doc.data();
      players.push({
        id: p.id,
        name: p.name || '',
        email: p.email || '',
        phone: p.phone || '',
        dateOfBirth: p.dateOfBirth || '',
        gender: p.gender || 'prefer-not-to-say',
        color: p.color || 'red',
        hasPhoto: p.hasPhoto || false,
        hasWeapon: p.hasWeapon || false,
        photoUrl: p.photoUrl || undefined,
        selectedWeapon: p.selectedWeapon || undefined,
        signature: p.signature || undefined,
        agreedToTerms: p.agreedToTerms || false,
      });
    });

    return {
      sessionCode: teamData.sessionCode,
      teamName: teamData.teamName || 'Unknown Team',
      players,
      maxPlayers: teamData.maxPlayers || 6,
      createdAt: teamData.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      storeId: teamData.storeId || '',
      selectedGame: teamData.selectedGame || '',
    };
  } catch (error) {
    console.error('loadTeamFromFirebase:error', error);
    throw error;
  }
};

// Update team with staff-specific data (photos, weapons)
export const updateTeamStaffData = async (sessionCode: string, updates: any): Promise<void> => {
    try {
        const teamRef = doc(db, 'teams', sessionCode);
        await updateDoc(teamRef, {
            ...updates,
            staffUpdatedAt: serverTimestamp()
        });
    } catch (error) {
        console.error('Error updating team staff data:', error);
        throw error;
    }
};

// firebase-service.ts
export const getSessionHistory = (storeId?: string): Promise<SessionHistory[]> => {
    return new Promise((resolve) => {
        const logsRef = collection(db, 'registrationLogs');
        let q = query(logsRef, orderBy('completedAt', 'desc'), limit(20));

        onSnapshot(q, (snap) => {
            const history: SessionHistory[] = [];
            snap.forEach((doc) => {
                const data = doc.data();
                console.log(data);
                if (!storeId || storeId === 'DEFAULT' || data.storeId === storeId) {
                    history.push({
                        sessionCode: data.sessionCode,
                        teamName: data.teamName,
                        playerCount: data.playerCount,
                        createdAt: data.completedAt?.toDate?.()?.toLocaleString('ja-JP') || 'Unknown',
                        storeId: data.storeId || '',
                        selectedGame: data.selectedGame || '',
                    });
                }
            });
            resolve(history);
        });
    });
};

// Mark team as ready for gameplay
export const markTeamReady = async (sessionCode: string): Promise<void> => {
    try {
        const teamRef = doc(db, 'teams', sessionCode);
        await updateDoc(teamRef, {
            status: 'ready_for_gameplay',
            staffCompletedAt: serverTimestamp(),
        });
    } catch (error) {
        console.error('Error marking team ready:', error);
        throw error;
    }
};
