// Google JavaScript Style Guide (https://google.github.io/styleguide/jsguide.html)

/*
TO DOs
1. Take command line arg for text orientaion i.e. landscape or portrait
2. Apply Hough Transform to reduce the number of images to perform character detection from 4 to 2
3. Apply object detection to count the number of recognised chracters
4. Compare the results from the two chosen images and pick the one with most score
5. Determine the rotation degree and rotate

// Tried https://www.npmjs.com/package/tesseract.js
// Whether text orientation is up-side-down or on the side in the image, Tesseract still output giberlish Japanese

*/

import * as fileFunctions from './utils/fileSystemFunctions'
import {
  readdirSync,
  statSync,
  renameSync
} from 'fs'

// `import * as sharp from 'sharp'` doesn't work here.
//  error TS2349: This expression is not callable. Type 'typeof sharp' has no call signatures.
// REFERECE: https://stackoverflow.com/questions/46677752/the-difference-between-requirex-and-import-x
// Due to the incompatibility of CommonJS and ES6 and lack of another transpiler, Babel, that converts `import` to `require`.
const sharp = require('sharp')

const srcDirPath = '/home/to/Desktop/k1/'
const destDirPath = './processed/'

type ImageFile = {
  srcFilePathAndName: string,
  processedFilePathAndName: string,
  fileExtention: string,
  modifiedTime: number
}

const processedDirPath =
  fileFunctions.getAbsolutePath(srcDirPath, destDirPath)

const imageFileArray: ImageFile[] = []

fileFunctions.makeCleanDir(processedDirPath)

readdirSync(srcDirPath, { withFileTypes: true }).forEach((dirObj) => {
  const imageFileName: string = dirObj.name
  const fileExtension: string | null = isImageFile(imageFileName)

  if (dirObj.isFile() && (fileExtension !== null)) {
    const srcFilePathAndName: string =
      fileFunctions.getAbsolutePath(srcDirPath, imageFileName)

    const imageFile: ImageFile = {
      srcFilePathAndName: srcFilePathAndName,
      processedFilePathAndName: fileFunctions.getAbsolutePath(processedDirPath, imageFileName),
      fileExtention: fileExtension,
      modifiedTime: statSync(srcFilePathAndName).mtimeMs // ctimeMs is not reliable
    }

    imageFileArray.push(imageFile)
  }
})

const imageFileArraySorted =
  imageFileArray.sort((a, b) => a.modifiedTime - b.modifiedTime)

const imageFileCount = imageFileArray.length

if (imageFileCount !== 0) {
  imageFileArraySorted.forEach((imageFile) => {
    const numberedFileName =
      (imageFileArraySorted.indexOf(imageFile) + 1) +
      ' of ' +
      imageFileCount +
      '.' +
      imageFile.fileExtention

    sharp(imageFile.srcFilePathAndName)
      .rotate(90)
      .toFile(imageFile.processedFilePathAndName, (err: string, info: string) => {
        if (err === null) {
          renameSync(imageFile.processedFilePathAndName,
            fileFunctions.getAbsolutePath(processedDirPath, numberedFileName))
        } else {
          console.log(err)
        }
      })
  })
}

function isImageFile (fileName: string): string | null {
  const fileExtension: string = fileFunctions.getExtention(fileName)
  switch (fileExtension) {
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'bmp':
    case 'tiff':
    case 'tif':
    case 'gif':
      return fileExtension
    default:
      return null
  }
}
