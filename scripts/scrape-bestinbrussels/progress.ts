import * as fs from 'fs';
import * as path from 'path';
import { ProgressData } from './types';

const PROGRESS_FILE = path.join(__dirname, 'scrape-progress.json');

function getDefaultProgress(): ProgressData {
  return {
    scraped: [],
    rewritten: [],
    saved: [],
    errors: [],
    lastRun: new Date().toISOString(),
  };
}

export function loadProgress(): ProgressData {
  try {
    if (fs.existsSync(PROGRESS_FILE)) {
      const data = fs.readFileSync(PROGRESS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch {
    console.log('Could not load progress file, starting fresh.');
  }
  return getDefaultProgress();
}

export function saveProgress(progress: ProgressData): void {
  progress.lastRun = new Date().toISOString();
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

export function markScraped(progress: ProgressData, url: string): void {
  if (!progress.scraped.includes(url)) {
    progress.scraped.push(url);
    saveProgress(progress);
  }
}

export function markRewritten(progress: ProgressData, url: string): void {
  if (!progress.rewritten.includes(url)) {
    progress.rewritten.push(url);
    saveProgress(progress);
  }
}

export function markSaved(progress: ProgressData, url: string): void {
  if (!progress.saved.includes(url)) {
    progress.saved.push(url);
    saveProgress(progress);
  }
}

export function logError(progress: ProgressData, url: string, error: string, phase: string): void {
  progress.errors.push({
    url,
    error,
    phase,
    timestamp: new Date().toISOString(),
  });
  saveProgress(progress);
}
