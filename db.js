const fs = require('fs').promises;
/*
All of your functions must return a promise!
*/

/* 
Every function should be logged with a timestamp.
If the function logs data, then put that data into the log
ex after running get('user.json', 'email'):
  sroberts@talentpath.com 1563221866619

If the function just completes an operation, then mention that
ex after running delete('user.json'):
  user.json succesfully delete 1563221866619

Errors should also be logged (preferably in a human-readable format)
*/
function log(options) {
  return fs.appendFile('log.txt', `Message: ${options} @Timestamp: ${Date.now()}\n`);
}

/**
 * Logs the value of object[key]
 * @param {string} file
 * @param {string} key
 */
async function get(file, key) {
  /**
   * 1. read file
   * 2. handle promises
   * 3. parse data to JSOn
   * 4. use key to get the value of object[key]
   * 5. append log file with above value
   */
  try {
    const data = await fs.readFile(file, 'utf-8');
    const parsed = JSON.parse(data);
    const value = parsed[key];
    if(!value) return log(`Error ${key} invalid on ${file}`)
    return log(`Get ${key} on ${file} -> ${value}`);
  } catch(err) {
    log(`Error no file or directory on ${file} -> ${err}`);
  }
}

/**
 * Sets the value of object[key] and rewrites object to file
 * @param {string} file
 * @param {string} key
 * @param {string} value
 */
async function set(file, key, value) {
  try {
    const data = await fs.readFile(file, 'utf-8');
    const parsed = JSON.parse(data);
    parsed[key] = value;
    const stringed = JSON.stringify(parsed);
    await fs.writeFile(file, stringed);
    return log(`Set ${key} on ${file} -> ${value}`)
  } catch(err) {
    log(`Error ${err}`);
  }
}

/**
 * Deletes key from object and rewrites object to file
 * @param {string} file
 * @param {string} key
 */
async function remove(file, key) {
  try {
    const data = await fs.readFile(file, 'utf-8');
    const parsed = JSON.parse(data);
    parsed[key] = undefined;
    const stringed = JSON.stringify(parsed);
    await fs.writeFile(file, stringed);
    return log(`Remove ${key} on ${file}`);
  } catch(err) {
    log(`Error ${err}`);
  }
}

/**
 * Deletes file.
 * Gracefully errors if the file does not exist.
 * @param {string} file
 */
async function deleteFile(file) {
  try {
    await fs.unlink(file);
  } catch(err) {
    console.log(`Error: ${file} does not exist`);
  }
}

/**
 * Creates file with an empty object inside.
 * Gracefully errors if the file already exists.
 * @param {string} file JSON filename
 */
async function createFile(file) {
  try{ 
    const path = `./${file}`;
    const data = await fs.readFile(path, 'utf-8');
    if(data[0]) {
      // file already exists
      await log(`CreateFile DENIED: ${file} already exists`);
      return console.log(`${file} already exists`);
    }
  } catch(err) {
    if(err.code === 'ENOENT') {
      // then make the damn file
      await fs.writeFile(file, '{}');
      return log(`CreateFile ${file}`);
    } else {
      console.log(`ERROR: ${err}`)
    }
  }
}

/**
 * Merges all data into a mega object and logs it.
 * Each object key should be the filename (without the .json) and the value should be the contents
 * ex:
 *  {
 *  user: {
 *      "firstname": "Scott",
 *      "lastname": "Roberts",
 *      "email": "sroberts@talentpath.com",
 *      "username": "scoot"
 *    },
 *  post: {
 *      "title": "Async/Await lesson",
 *      "description": "How to write asynchronous JavaScript",
 *      "date": "July 15, 2019"
 *    }
 * }
 */
async function mergeData() {
  // get all files
  try {
    let arrOfJSONs = [];
    let objectToWrite = {};
    const data = await fs.readdir(__dirname);
    data.forEach(datum => {
      if(datum.includes('json') && (!datum.includes('package'))) {
        arrOfJSONs.push(datum);
      }
    });
    for(let i = 0; i < arrOfJSONs.length; ++i) {
      const file = await fs.readFile(arrOfJSONs[i]);
      const parsed = JSON.parse(file);
      const fileName = arrOfJSONs[i].slice(0, arrOfJSONs[i].indexOf('.'));
      objectToWrite[fileName] = parsed;
    }
    objectToWrite = JSON.stringify(objectToWrite);
    return fs.appendFile('log.txt', `MergeData Performed -> ${objectToWrite}\n`);
  } catch(err) {
    console.log(`ERORR: ${err}`);
  }
};

/**
 * Takes two files and logs all the properties as a list without duplicates
 * @param {string} fileA
 * @param {string} fileB
 * @example
 *  union('scott.json', 'andrew.json')
 *  // ['firstname', 'lastname', 'email', 'username']
 */
async function union(fileA, fileB) {
  try{
    const fileA1 = await fs.readFile(fileA);
    const fileB1 = await fs.readFile(fileB);
    const parsed1 = JSON.parse(fileA1);
    const parsed2 = JSON.parse(fileB1);
    // one of the file's keys are guaranteed to be used as reference
    let returnedArr = [];
    for(key in parsed1) {
      returnedArr.push(key);
    }
    for(key in parsed2) {
      // only add if it doesnt exist
      if(!returnedArr.includes(key)) {
        returnedArr.push(key);
      }
    }
    return log(`Union Performed ${returnedArr}`);
  } catch(err) {
    log(`ERROR: ${err}`);
  }
}

/**
 * Takes two files and logs all the properties that both objects share
 * @param {string} fileA
 * @param {string} fileB
 * @example
 *    intersect('scott.json', 'andrew.json')
 *    // ['firstname', 'lastname', 'email']
 */
async function intersect(fileA, fileB) {
  try {
    const fileA1 = await fs.readFile(fileA);
    const fileB1 = await fs.readFile(fileB);
    const parsed1 = JSON.parse(fileA1);
    const parsed2 = JSON.parse(fileB1);
    let returnedArr = [];
    for(key1 in parsed1) {
      for(key2 in parsed2) {
        if(key1 === key2) {
          returnedArr.push(key1);
        }
      }
    }
    return log(`Intersection Performed ${returnedArr}`);
  } catch(err) {
    log(`ERROR: ${err}`)
  }
}

/**
 * Takes two files and logs all properties that are different between the two objects
 * @param {string} fileA
 * @param {string} fileB
 * @example
 *    difference('scott.json', 'andrew.json')
 *    // ['username']
 */
async function difference(fileA, fileB) {
  try {
    const fileA1 = await fs.readFile(fileA);
    const fileB1 = await fs.readFile(fileB);
    const parsed1 = JSON.parse(fileA1);
    const parsed2 = JSON.parse(fileB1);
    let similarArr = [];
    let differentArr = [];
    for(key1 in parsed1) {
      for(key2 in parsed2) {
        if(key1 === key2) {
          similarArr.push(key1);
        }
      }
    }
    // all similar keys are now logged into array
    for(key in parsed1) {
      if(!similarArr.includes(key)) {
        differentArr.push(key);
      }
    }
    for(key in parsed2) {
      if(!similarArr.includes(key)) {
        differentArr.push(key);
      }
    }
    // difference is now recorded
    return log(`Difference Performed ${differentArr}`);
  } catch(err) {
    log(`ERROR: ${err}`)
  }
}

module.exports = {
  get,
  set,
  remove,
  deleteFile,
  createFile,
  mergeData,
  union,
  intersect,
  difference,
};
