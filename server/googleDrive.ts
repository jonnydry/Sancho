import { google } from 'googleapis';

let connectionSettings: any;

async function getAccessToken() {
  if (connectionSettings?.settings?.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  if (!hostname) {
    throw new Error('Google Drive not connected');
  }
  
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('Google Drive not connected');
  }

  try {
    connectionSettings = await fetch(
      'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=google-drive',
      {
        headers: {
          'Accept': 'application/json',
          'X_REPLIT_TOKEN': xReplitToken
        }
      }
    ).then(res => res.json()).then(data => data.items?.[0]);
  } catch (error) {
    console.warn('Failed to fetch Google Drive connection:', error);
    throw new Error('Google Drive not connected');
  }

  if (!connectionSettings) {
    throw new Error('Google Drive not connected');
  }

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings?.settings?.oauth?.credentials?.access_token;

  if (!accessToken) {
    throw new Error('Google Drive not connected');
  }
  return accessToken;
}

export async function getUncachableGoogleDriveClient() {
  const accessToken = await getAccessToken();

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({
    access_token: accessToken
  });

  return google.drive({ version: 'v3', auth: oauth2Client });
}

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime: string;
  size?: string;
}

export async function listDriveFiles(pageToken?: string): Promise<{ files: DriveFile[]; nextPageToken?: string }> {
  try {
    const drive = await getUncachableGoogleDriveClient();

    const response = await drive.files.list({
      q: "(mimeType='text/plain' or mimeType='text/markdown' or mimeType='text/x-markdown' or mimeType='application/vnd.google-apps.document')",
      fields: 'nextPageToken, files(id, name, mimeType, modifiedTime, size)',
      orderBy: 'modifiedTime desc',
      pageSize: 20,
      pageToken: pageToken || undefined,
    });

    return {
      files: (response.data.files || []).map(f => ({
        id: f.id || '',
        name: f.name || 'Untitled',
        mimeType: f.mimeType || '',
        modifiedTime: f.modifiedTime || '',
        size: f.size || undefined,
      })),
      nextPageToken: response.data.nextPageToken || undefined,
    };
  } catch (error: any) {
    if (error.message === 'Google Drive not connected') {
      throw error;
    }
    console.error('Error listing Google Drive files:', error);
    throw new Error('Failed to list Google Drive files');
  }
}

export async function readDriveFile(fileId: string): Promise<{ content: string; name: string }> {
  try {
    const drive = await getUncachableGoogleDriveClient();

    const meta = await drive.files.get({ fileId, fields: 'id, name, mimeType' });
    const name = meta.data.name || 'Untitled';
    const mimeType = meta.data.mimeType || '';

    let content: string;

    if (mimeType === 'application/vnd.google-apps.document') {
      const exported = await drive.files.export({ fileId, mimeType: 'text/plain' });
      content = typeof exported.data === 'string' ? exported.data : String(exported.data);
    } else {
      const downloaded = await drive.files.get(
        { fileId, alt: 'media' },
        { responseType: 'text' }
      );
      content = typeof downloaded.data === 'string' ? downloaded.data : String(downloaded.data);
    }

    return { content, name };
  } catch (error: any) {
    if (error.message === 'Google Drive not connected') {
      throw error;
    }
    console.error('Error reading Google Drive file:', error);
    throw new Error('Failed to read file from Google Drive');
  }
}

export interface ExportNoteResult {
  success: boolean;
  fileId?: string;
  fileName?: string;
  webViewLink?: string;
  error?: string;
}

export async function exportNoteToGoogleDrive(
  title: string,
  content: string,
  tags: string[],
  createdAt: number
): Promise<ExportNoteResult> {
  try {
    const drive = await getUncachableGoogleDriveClient();
    
    const createdDate = new Date(createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const tagsLine = tags.length > 0 ? `\n\nTags: ${tags.join(', ')}` : '';
    
    const markdownContent = `# ${title || 'Untitled Note'}

*Created: ${createdDate}*${tagsLine}

---

${content}
`;

    const sanitizedTitle = (title || 'Untitled Note').replace(/[<>:"/\\|?*]/g, '_').substring(0, 100);
    const fileName = `${sanitizedTitle}.md`;

    const fileMetadata = {
      name: fileName,
      mimeType: 'text/markdown',
    };

    const media = {
      mimeType: 'text/markdown',
      body: markdownContent,
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id, name, webViewLink',
    });

    return {
      success: true,
      fileId: response.data.id || undefined,
      fileName: response.data.name || undefined,
      webViewLink: response.data.webViewLink || undefined,
    };
  } catch (error: any) {
    console.error('Error exporting note to Google Drive:', error);
    
    if (error.message === 'Google Drive not connected') {
      return {
        success: false,
        error: 'Google Drive is not connected. Please connect your Google Drive first.',
      };
    }
    
    return {
      success: false,
      error: error.message || 'Failed to export note to Google Drive',
    };
  }
}
