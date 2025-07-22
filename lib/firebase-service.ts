import { db, storage } from './firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs,
  serverTimestamp,
  addDoc 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from 'firebase/storage';
import { Team, Player } from './types';

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
      completedAt: serverTimestamp()
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

// Load team data from Firebase (for staff app)
export const loadTeamFromFirebase = async (sessionCode: string): Promise<Team | null> => {
  try {
    const teamRef = doc(db, 'teams', sessionCode);
    const teamSnap = await getDoc(teamRef);
    
    if (teamSnap.exists()) {
      const teamData = teamSnap.data();
      
      // Load players from subcollection
      const playersRef = collection(db, 'teams', sessionCode, 'players');
      const playersSnap = await getDocs(playersRef);
      
      const players: Player[] = [];
      playersSnap.forEach((doc) => {
        players.push(doc.data() as Player);
      });
      
      return {
        ...teamData,
        players
      } as Team;
    }
    return null;
  } catch (error) {
    console.error('Error loading team:', error);
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
      status: 'registration_completed'
    });
  } catch (error) {
    console.error('Error logging registration:', error);
    throw error;
  }
};
