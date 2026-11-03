// Client-safe playlist and video library data, kept apart from the full page dataset.
import playlistsJson from '@/data/playlists.json';
import videoLibraryJson from '@/data/video-library.json';
import type { PlaylistRecord } from './site-data';

const playlistsMap = playlistsJson as unknown as Record<string, PlaylistRecord>;

export function getPlaylistData(playlistId: string): PlaylistRecord | null {
  return playlistsMap[playlistId] || null;
}

export function getAllPlaylists(): PlaylistRecord[] {
  return Object.values(playlistsMap);
}

export function getVideoLibraryData() {
  return videoLibraryJson;
}
