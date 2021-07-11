import { posix } from 'path'
import {
  existsSync,
  rmdirSync,
  mkdirSync
} from 'fs'

export function makeCleanDir (dirPath: string) {
  if (existsSync(dirPath)) {
    // without `recursive`, a folder with files in it does not get deleted
    rmdirSync(dirPath, { recursive: true })
  }

  mkdirSync(dirPath)
}

export function getAbsolutePath (dirPath: string, fileOrDirName: string): string {
// This is a safer approach without a trailing `/` included in the dirPath or not
  return posix.resolve(dirPath, fileOrDirName)
}

export function getExtention (fileName: string): string {
  return fileName.toLowerCase().split('.').pop() as string
}
