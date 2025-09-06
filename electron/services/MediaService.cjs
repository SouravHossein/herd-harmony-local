// services/mediaService.cjs
const { dialog, shell, app } = require('electron');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const mime = require('mime-types');




const DatabaseService = require('./databaseService.cjs'); // adjust path if needed
const FileService = require('./fileService.cjs'); // your existing fileService (uses writeBase64File etc.)
const { getMimeType } = require('../helpers/mime.cjs');
const { createImageThumbnail, createVideoThumbnail } = require('../helpers/thumbs.cjs');

const databaseService = new DatabaseService();
const fileService = new FileService();

const MEDIA_ROOT = () => path.join(app.getPath('userData'), 'goat-tracker-media');
const TMP_ROOT = () => path.join(app.getPath('userData'), 'tmp');

// ensure root dirs exist
if (!fs.existsSync(MEDIA_ROOT())) fs.mkdirSync(MEDIA_ROOT(), { recursive: true });
if (!fs.existsSync(TMP_ROOT())) fs.mkdirSync(TMP_ROOT(), { recursive: true });

// in-memory uploads map
const uploads = {}; // { uploadId: { writeStream, tmpPath, meta } }

function uniqueFilename(originalName) {
  const ext = path.extname(originalName) || '';
  const base = `${Date.now()}-${Math.random().toString(36).slice(2,9)}`;
  return `${base}${ext}`;
}

/**
 * Add media via OS dialog (main process selection)
 */
async function addViaDialog(goatId, category, description, tags) {
  try {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections'],
      filters: [
        { name: 'Images & Videos', extensions: ['jpg','jpeg','jfif','png','gif','mp4','webm','mov'] }
      ]
    });
    if (canceled || !filePaths || filePaths.length === 0) return [];

    const destDir = path.join(MEDIA_ROOT(), goatId);
    const thumbDir = path.join(destDir, 'thumbnails');
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
    if (!fs.existsSync(thumbDir)) fs.mkdirSync(thumbDir, { recursive: true });

    const results = [];
    for (const src of filePaths) {
      try {
        const stat = fs.statSync(src);
        const size = stat.size;
        const mimeType = getMimeType(src);
        if (!mimeType.startsWith('image/') && !mimeType.startsWith('video/')) continue;

        const MAX = 500 * 1024 * 1024; // 500MB cap for dialog-based copy
        if (size > MAX) continue;

        const newName = uniqueFilename(path.basename(src));
        const dest = path.join(destDir, newName);
        fs.copyFileSync(src, dest);

        let thumbnailRel = null;
        if (mimeType.startsWith('image/')) {
          const thumbPath = path.join(thumbDir, `${path.parse(newName).name}.jpg`);
          const created = await createImageThumbnail(dest, thumbPath, 320);
          if (created) thumbnailRel = path.join(goatId, 'thumbnails', path.basename(created));
          console.log('Created image thumbnail for', dest, 'at', created);
        } else if (mimeType.startsWith('video/')) {
          console.log('Creating video thumbnail for', dest);
          const thumbPath = path.join(thumbDir, `${path.parse(newName).name}.jpg`);
          try {
            await createVideoThumbnail(dest, thumbPath, '00:00:01');
            thumbnailRel = path.join(goatId, 'thumbnails', path.basename(thumbPath));
            console.log('Created video thumbnail for', dest, 'at', thumbPath);
          } catch (e) {
            console.warn('video thumbnail failed', e);
          }
        }

        const mediaItem = {
          goatId,
          type: mimeType.startsWith('image/') ? 'image' : 'video',
          url: path.join(goatId, newName), // relative
          thumbnailUrl: thumbnailRel,
          primary: false,
          filename: path.basename(src),
          uploadDate: new Date().toISOString(),
          timestamp: new Date().toISOString(),
          category,
          tags,
          description,
          size,
          createdAt: new Date().toISOString()
        };

        const saved = databaseService.add('media', mediaItem);
        results.push(saved);
      } catch (inner) {
        console.error('addViaDialog inner', inner);
      }
    }
    return results;
  } catch (err) {
    console.error('addViaDialog', err);
    return [];
  }
}

/**
 * Chunked upload API (start)
 */
async function uploadStart(meta) {
  try {
    const uploadId = meta.uploadId || uuidv4();
    const tmpPath = path.join(TMP_ROOT(), `${uploadId}.tmp`);
    const ws = fs.createWriteStream(tmpPath, { flags: 'w' });
    uploads[uploadId] = { writeStream: ws, tmpPath, meta };
    return { uploadId };
  } catch (err) {
    console.error('uploadStart', err);
    throw err;
  }
}

/**
 * Chunked upload (write chunk to tmp file)
 */
function uploadChunk(uploadId, chunk) {
  try {
    const u = uploads[uploadId];
    if (!u) {
      console.warn('missing uploadId', uploadId);
      return false;
    }
    const buffer = Buffer.from(chunk);
    u.writeStream.write(buffer);
    return true;
  } catch (err) {
    console.error('uploadChunk', err);
    return false;
  }
}

/**
 * Chunked upload complete -> move tmp to media dir, create thumb, save metadata
 */
async function uploadComplete(uploadId) {
  try {
    const u = uploads[uploadId];
    if (!u) throw new Error('upload not found');
    await new Promise((res) => u.writeStream.end(() => res()));
    const { tmpPath, meta } = u;
    const goatId = meta.goatId;
    const destDir = path.join(MEDIA_ROOT(), goatId);
    const thumbDir = path.join(destDir, 'thumbnails');
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
    if (!fs.existsSync(thumbDir)) fs.mkdirSync(thumbDir, { recursive: true });

    const safeName = uniqueFilename(meta.filename || 'file');
    const destPath = path.join(destDir, safeName);
    fs.renameSync(tmpPath, destPath);
  
    const mimeType = getMimeType(destPath);
    const stats = fs.statSync(destPath);
    const size = stats.size;

    const MAX = 2 * 1024 * 1024 * 1024; // 2GB cap for chunked upload (adjust as needed)
    if (size > MAX) {
      try { fs.unlinkSync(destPath); } catch (e) {}
      delete uploads[uploadId];
      throw new Error('file too large');
    }
    console.log('Uploaded file saved to', destPath, 'size', size, 'type', mimeType);
    let thumbnailRel = null;
    if (mimeType.startsWith('image/')) {
      console.log('Creating image thumbnail for', destPath);
      const thumbPath = path.join(thumbDir, `${path.parse(safeName).name}.jpg`);
      const created = await createImageThumbnail(destPath, thumbPath, 320);
      if (created) thumbnailRel = path.join(goatId, 'thumbnails', path.basename(created));
      console.log('Created image thumbnail for', destPath, 'at', created);
      console.log(mimeType);
    } else if (mimeType.startsWith('video/')) {
      console.log('Creating video thumbnail for', destPath);
      const thumbPath = path.join(thumbDir, `${path.parse(safeName).name}.jpg`);
      try {
        console.log('Creating video thumbnail for', destPath);
        await createVideoThumbnail(destPath, thumbPath, '00:00:01');
        thumbnailRel = path.join(goatId, 'thumbnails', path.basename(thumbPath));
        console.log('Created video thumbnail for', destPath, 'at', thumbPath);
      } catch (e) {
        console.warn('video thumbnail failed', e);
      }
      console.log(mimeType);
    }

    const mediaItem = {
      goatId,
      type: mimeType.startsWith('image/') ? 'image' : 'video',
      url: path.join(goatId, safeName),
      thumbnailUrl: thumbnailRel,
      primary: false,
      filename: meta.filename,
      uploadDate: new Date().toISOString(),
      timestamp: new Date().toISOString(),
      category: meta.category,
      tags: meta.tags,
      description: meta.description,
      size,
      createdAt: new Date().toISOString(),
    };

    const saved = databaseService.add('media', mediaItem);
    delete uploads[uploadId];
    return saved;
  } catch (err) {
    console.error('uploadComplete', err);
    throw err;
  }
}

/**
 * getByGoatId: return metadata but map thumbnail to data URL and url to app:// path
 */
async function getByGoatId(goatId) {
  try {
    const all = databaseService.getAll('media').filter(m => m.goatId === goatId);
    const out = all.map(m => {
      const thumbRel = m.thumbnailUrl;
      const thumbAbs = thumbRel ? path.join(MEDIA_ROOT(), thumbRel) : null;
      const thumbDataUrl = thumbAbs && fs.existsSync(thumbAbs) ? fileToDataUrl(thumbAbs) : null;
      const url = m.url ? `app://${m.url.replace(/\\/g, '/')}` : null;
      return { ...m, url, thumbnailUrl: thumbDataUrl };
    });
    return out;
  } catch (err) {
    console.error('getByGoatId', err);
    return [];
  }
}
async function getThumbnails(params) {
  try {
    const all = databaseService.getAll('media');
    let filtered = all.filter(m => m.primary === true);
    const out = filtered.map(m => {

      const thumbRel = m.thumbnailUrl;
      const goatId = m.goatId;
      const thumbAbs = thumbRel ? path.join(MEDIA_ROOT(), thumbRel) : null;
      const thumbDataUrl = thumbAbs && fs.existsSync(thumbAbs) ? fileToDataUrl(thumbAbs) : null;
      return { goatId, thumbnailUrl: thumbDataUrl };
    });
    return out;
  } catch (err) {
    console.error('getThumbnails', err);
    return [];
  }
}
/**
 * helper: convert file to data URL (used for thumbnails)
 */
function fileToDataUrl(absPath) {
  try {
    const buf = fs.readFileSync(absPath);
    const m = getMimeType(absPath);
    return `data:${m};base64,${buf.toString('base64')}`;
  } catch (e) {
    console.error('fileToDataUrl', e);
    return null;
  }
}

/**
 * update metadata (category, description, tags)
 */
function updateMedia(id, updates) {
  try {
    const allowed = { ...updates };
    delete allowed.url;
    delete allowed.thumbnailUrl;
    return databaseService.update('media', id, allowed);
  } catch (err) {
    console.error('updateMedia', err);
    return null;
  }
}

/**
 * delete media (db record + file + thumbnail)
 */
function deleteMedia(id) {
  try {
    const deleted = databaseService.delete('media', id);
    if (!deleted) return false;
    try { const full = path.join(MEDIA_ROOT(), deleted.url); if (fs.existsSync(full)) fs.unlinkSync(full); } catch (e) { console.error(e); }
    try { if (deleted.thumbnailUrl) { const tfull = path.join(MEDIA_ROOT(), deleted.thumbnailUrl); if (fs.existsSync(tfull)) fs.unlinkSync(tfull); } } catch (e) { console.error(e); }
    return true;
  } catch (err) {
    console.error('deleteMedia', err);
    return false;
  }
}

/**
 * setPrimary: set selected media as primary for a goat (one primary per goat)
 */
function setPrimary(goatId, mediaId) {
  try {
    const all = databaseService.getAll('media').filter(m => m.goatId === goatId);
    all.forEach(m => {
      const updates = { primary: m.id === mediaId };
      databaseService.update('media', m.id, updates);
    });
    // return newly primary
    return databaseService.getAll('media').find(m => m.id === mediaId) || null;
  } catch (err) {
    console.error('setPrimary', err);
    return null;
  }
}

/**
 * downloadMedia: show save dialog and copy file
 */
async function downloadMedia(mediaId) {
  try {
    const m = databaseService.getAll('media').find(x => x.id === mediaId);
    if (!m) return { success: false, error: 'not found' };
    const abs = path.join(MEDIA_ROOT(), m.url);
    if (!fs.existsSync(abs)) return { success: false, error: 'file missing' };

    const { canceled, filePath } = await dialog.showSaveDialog({
      defaultPath: m.filename
    });
    if (canceled || !filePath) return { success: false, error: 'canceled' };

    fs.copyFileSync(abs, filePath);
    return { success: true };
  } catch (err) {
    console.error('downloadMedia', err);
    return { success: false, error: String(err) };
  }
}

function getMediaFilePath(mediaId) {
  const m = databaseService.getAll('media').find(x => x.id === mediaId);
  return m ? path.join(MEDIA_ROOT(), m.url) : null;
}

async function openMediaFile(mediaId) {
  try {
    const p = getMediaFilePath(mediaId);
    if (!p) return false;
    if (!fs.existsSync(p)) return false;
    await shell.openPath(p);
    return true;
  } catch (e) {
    console.error('openMediaFile', e);
    return false;
  }
}

function revealMediaFileInFolder(mediaId) {
  try {
    const p = getMediaFilePath(mediaId);
    if (!p) return false;
    if (!fs.existsSync(p)) return false;
    shell.showItemInFolder(p);
    return true;
  } catch (e) {
    console.error('revealMediaFileInFolder', e);
    return false;
  }
}

module.exports = {
  addViaDialog,
  uploadStart,
  uploadChunk,
  uploadComplete,
  getByGoatId,
  getThumbnails,
  updateMedia,
  deleteMedia,
  setPrimary,
  downloadMedia,
  getMediaFilePath,
  openMediaFile,
  revealMediaFileInFolder
};
