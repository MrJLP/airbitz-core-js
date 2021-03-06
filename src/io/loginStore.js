import { scrypt, userIdSnrp } from '../crypto/scrypt.js'
import { updateLoginStash } from '../login/login.js'
import { base58, base64 } from '../util/encoding.js'

/**
 * Handles login data storage.
 * TODO: Make all methods async!
 */
export class LoginStore {
  constructor (io) {
    this.storage = io.folder.getFolder('logins')
  }

  /**
   * Lists the usernames that have data in the store.
   */
  listUsernames () {
    return this.storage.listFiles().map(filename => {
      return this.storage.getFileJson(filename).username
    })
  }

  /**
   * Finds the loginStash for the given username.
   */
  load (username) {
    return Promise.resolve(this.loadSync(username))
  }

  /**
   * Same thing as `load`, but doesn't block on the `userId`.
   */
  loadSync (username) {
    const filename = this._findFilename(username)
    return filename != null
      ? this.storage.getFileJson(filename)
      : { username: fixUsername(username), appId: '' }
  }

  /**
   * Removes any loginStash that may be stored for the given username.
   */
  remove (username) {
    const filename = this._findFilename(username)
    if (filename != null) {
      this.storage.removeFile(filename)
    }
  }

  /**
   * Saves a loginStash.
   */
  save (loginStash) {
    const loginId = base64.parse(loginStash.loginId)
    if (loginStash.appId == null) {
      throw new Error('Cannot save a login without an appId.')
    }
    if (loginId.length !== 32) {
      throw new Error('Invalid loginId')
    }
    const filename = base58.stringify(loginId) + '.json'
    this.storage.setFileJson(filename, loginStash)
  }

  /**
   * Updates the selected login stash.
   * The `username` gives the root of the search,
   * and the `targetLoginId` gives the node to update.
   * The `update` callback is called on the selected node,
   * and can make any modifications it likes.
   */
  update (rootLogin, targetLogin, update) {
    return this.load(rootLogin.username).then(loginStash => {
      if (loginStash.loginId == null) {
        throw new Error(`Could not load stash for "${rootLogin.username}"`)
      }
      const target = base64.stringify(targetLogin.loginId)
      return this.save(
        updateLoginStash(loginStash, stash => stash.loginId === target, update)
      )
    })
  }

  _findFilename (username) {
    const fixedName = fixUsername(username)
    return this.storage.listFiles().find(filename => {
      const loginStash = this.storage.getFileJson(filename)
      return loginStash && loginStash.username === fixedName
    })
  }
}

/**
 * Normalizes a username, and checks for invalid characters.
 * TODO: Support a wider character range via Unicode normalization.
 */
export function fixUsername (username) {
  const out = username
    .toLowerCase()
    .replace(/[ \f\r\n\t\v]+/g, ' ')
    .replace(/ $/, '')
    .replace(/^ /, '')

  for (let i = 0; i < out.length; ++i) {
    const c = out.charCodeAt(i)
    if (c < 0x20 || c > 0x7e) {
      throw new Error('Bad characters in username')
    }
  }
  return out
}

// Hashed username cache:
const userIdCache = {}

/**
 * Hashes a username into a userId.
 */
export function hashUsername (username) {
  const fixedName = fixUsername(username)
  if (userIdCache[fixedName] == null) {
    userIdCache[fixedName] = scrypt(fixedName, userIdSnrp)
  }
  return userIdCache[fixedName]
}
