import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
  signOut
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App singleton safely
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
// Required Google Drive scope
provider.addScope('https://www.googleapis.com/auth/drive.file');

// In-memory cache for OAuth access token (per workspace integration guidelines)
let cachedAccessToken: string | null = null;
let isSigningIn = false;

// Initialize auth state listener
export const initDriveAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        // Token not in memory; requires user-driven sign in to refresh
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

// Sign in with Google Popup to obtain Drive access token
export const signInWithGoogleDrive = async (loginHintEmail?: string): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    if (loginHintEmail) {
      provider.setCustomParameters({
        login_hint: loginHintEmail,
        prompt: 'select_account'
      });
    }

    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('গুগল ড্রাইভ অ্যাক্সেস টোকেন পাওয়া যায়নি');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Google Drive sign in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getDriveAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const logoutDrive = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

export const getDriveCurrentUser = (): User | null => {
  return auth.currentUser;
};

// Convert Base64 dataURL to Blob
export function dataURLtoBlob(dataurl: string): Blob {
  const arr = dataurl.split(',');
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

// Find or create a specific folder in Google Drive (e.g. "শাপলা মডেল প্রাথমিক বিদ্যালয় - Photo Gallery")
export async function findOrCreateDriveFolder(folderName: string, accessToken: string): Promise<string> {
  try {
    // 1. Search for existing folder
    const query = encodeURIComponent(`mimeType = 'application/vnd.google-apps.folder' and name = '${folderName}' and trashed = false`);
    const searchRes = await fetch(`https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name)`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (searchRes.ok) {
      const data = await searchRes.json();
      if (data.files && data.files.length > 0) {
        return data.files[0].id;
      }
    }

    // 2. Folder does not exist, create it
    const createRes = await fetch('https://www.googleapis.com/drive/v3/files', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
      }),
    });

    if (createRes.ok) {
      const folderData = await createRes.json();
      return folderData.id;
    }
  } catch (err) {
    console.warn('Could not create or find folder, fallback to root Drive', err);
  }
  return 'root';
}

export interface DriveUploadResult {
  success: boolean;
  fileId?: string;
  name?: string;
  webViewLink?: string;
  webContentLink?: string;
  folderId?: string;
  error?: string;
}

// Upload image file to registered mail's Google Drive
export async function uploadGalleryPhotoToDrive(
  imageData: string | Blob,
  fileName: string,
  caption: string,
  schoolName: string,
  targetEmail: string,
  existingToken?: string
): Promise<DriveUploadResult> {
  let token = existingToken || cachedAccessToken;

  // If token is missing, attempt interactive sign-in with registered school email hint
  if (!token) {
    try {
      const res = await signInWithGoogleDrive(targetEmail);
      if (res) {
        token = res.accessToken;
      }
    } catch (err: any) {
      return {
        success: false,
        error: `গুগল ড্রাইভ অথেনটিকেশন সম্পন্ন হয়নি: ${err?.message || 'লগইন বাতিল করা হয়েছে'}`
      };
    }
  }

  if (!token) {
    return {
      success: false,
      error: 'গুগল ড্রাইভ টোকেন অনুপস্থিত'
    };
  }

  try {
    // Convert base64 dataUrl to blob if needed
    const blob = typeof imageData === 'string' ? dataURLtoBlob(imageData) : imageData;
    const mimeType = blob.type || 'image/jpeg';
    const cleanFileName = fileName.endsWith('.jpg') || fileName.endsWith('.png') || fileName.endsWith('.jpeg')
      ? fileName
      : `${fileName}.jpg`;

    // 1. Get or create dedicated school folder
    const folderName = `${schoolName} - School Gallery (${targetEmail})`;
    const folderId = await findOrCreateDriveFolder(folderName, token);

    // 2. Multipart upload
    const metadata: Record<string, any> = {
      name: cleanFileName,
      mimeType,
      description: caption ? `ক্যাপশন: ${caption} | বিদ্যালয়: ${schoolName}` : `বিদ্যালয়: ${schoolName}`,
    };

    if (folderId && folderId !== 'root') {
      metadata.parents = [folderId];
    }

    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', blob);

    const uploadRes = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink,webContentLink,thumbnailLink',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      }
    );

    if (!uploadRes.ok) {
      const errText = await uploadRes.text();
      console.error('Drive upload failed response:', errText);
      return {
        success: false,
        error: `Google Drive আপলোড ব্যর্থ হয়েছে (${uploadRes.status}): ${errText}`
      };
    }

    const result = await uploadRes.json();

    // 3. Make the uploaded image publicly viewable so it renders seamlessly on the public school portal
    try {
      await fetch(`https://www.googleapis.com/drive/v3/files/${result.id}/permissions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: 'reader',
          type: 'anyone',
        }),
      });
    } catch (permErr) {
      console.warn('Could not set public permission on Drive file:', permErr);
    }

    return {
      success: true,
      fileId: result.id,
      name: result.name,
      webViewLink: result.webViewLink,
      webContentLink: result.webContentLink,
      folderId,
    };
  } catch (err: any) {
    console.error('Error uploading to Google Drive:', err);
    return {
      success: false,
      error: err?.message || 'গুগল ড্রাইভে আপলোড করতে গিয়ে ত্রুটি ঘটেছে'
    };
  }
}
