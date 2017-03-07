/* global describe it */
import { ABCDataStore } from '../src/ABCDataStore.js'
import chai from 'chai'
const { expect } = chai

process.stdout.write('\x1Bc')

describe('ABCDataStore', () => {
// abcWallet.dataStore.listKeys(folder, callback)
  describe('listKeys()', () => {
    const testData = {
      'logins': {'key1': 1, 'key2': 2, 'key3': 3},
      'repos': {'key1': 1, 'key2': 2, 'key3': 3},
      'accounts': {'key1': 1, 'key2': 2, 'key3': 3}
    }

    it('should return an array of keys', () => {
      const dataStore = new ABCDataStore('./', testData)
      const folder = 'logins'
      const expected = dataStore.listKeys(folder)

      expect(expected).to.be.an('array')
    })

    it('should return undefined for a non-existant folder', () => {
      const dataStore = new ABCDataStore('./', testData)
      const folder = 'newFolder'
      const expected = undefined
      const actual = dataStore.listKeys(folder)

      expect(expected).to.equal(actual)
    })
  })

// abcWallet.dataStore.readData(folder, key, callback)
  describe('readData()', () => {
    it('should return undefined for nonexistant keys', () => {
      const testData = {
        'logins': {'key1': 1, 'key2': 2, 'key3': 3},
        'repos': {'key1': 1, 'key2': 2, 'key3': 3},
        'accounts': {'key1': 1, 'key2': 2, 'key3': 3}
      }
      const dataStore = new ABCDataStore('./', testData)
      const expected = undefined
      const actual = dataStore.readData('accounts', 'non-existing-key')

      expect(actual).to.equal(expected)
    })

    it('should return undefined for nonexistant folders', () => {
      const testData = {
        'logins': {'key1': 1, 'key2': 2, 'key3': 3},
        'repos': {'key1': 1, 'key2': 2, 'key3': 3},
        'accounts': {'key1': 1, 'key2': 2, 'key3': 3}
      }
      const dataStore = new ABCDataStore('./', testData)
      const expected = undefined
      const actual = dataStore.readData('non-existing-folder', 'key1')

      expect(actual).to.equal(expected)
    })

    it('should return data from existing key', () => {
      const testData = {
        'logins': {'key1': 1, 'key2': 2, 'key3': 3},
        'repos': {'key1': 1, 'key2': 2, 'key3': 3},
        'accounts': {'key1': 1, 'key2': 2, 'key3': 3}
      }
      const dataStore = new ABCDataStore('./', testData)
      const expected = 2
      const actual = dataStore.readData('accounts', 'key2')

      expect(actual).to.equal(expected)
    })
  })

// writeData(folder, key, value, callback)
  describe('writeData()', () => {
    it('should write data to existing folder', () => {
      const testData = {
        'logins': {'key1': 1, 'key2': 2, 'key3': 3},
        'repos': {'key1': 1, 'key2': 2, 'key3': 3},
        'accounts': {'key1': 1, 'key2': 2, 'key3': 3}
      }
      const dataStore = new ABCDataStore('./', testData)
      const existingFolder = Object.keys(testData)[0]
      const newKey = 'newKey'
      const newValue = 'newValue'
      dataStore.writeData(existingFolder, newKey, newValue)
      const actual = dataStore.readData(existingFolder, newKey)
      const expected = newValue

      expect(actual).to.equal(expected)
    })

    it('should create and write data to non-existing folder', () => {
      const testData = {
        'logins': {'key1': 1, 'key2': 2, 'key3': 3},
        'repos': {'key1': 1, 'key2': 2, 'key3': 3},
        'accounts': {'key1': 1, 'key2': 2, 'key3': 3}
      }
      const dataStore = new ABCDataStore('./', testData)
      const newFolder = 'newFolder'
      const newKey = 'newKey'
      const newValue = 'newValue'
      dataStore.writeData(newFolder, newKey, newValue)
      const actual = dataStore.readData(newFolder, newKey)
      const expected = newValue

      expect(actual).to.equal(expected)
    })

    it('should overwrite data of existing key', () => {
      const testData = {
        'logins': {'key1': 1, 'key2': 2, 'key3': 3},
        'repos': {'key1': 1, 'key2': 2, 'key3': 3},
        'accounts': {'key1': 1, 'key2': 2, 'key3': 3}
      }
      const dataStore = new ABCDataStore('./', testData)
      const existingFolder = Object.keys(testData)[0]
      const key = Object.keys(existingFolder)[0]
      const newValue = 'newValue'
      dataStore.writeData(existingFolder, key, newValue)
      const actual = dataStore.readData(existingFolder, key)
      const expected = newValue

      expect(actual).to.equal(expected)
    })
  })

// abcWallet.dataStore.removeKey(folder, key, callback)
  describe('removeKey()', () => {
    it('should remove a key from the dataStore\'s list of keys', () => {
      const testData = {
        'logins': {'key1': 1, 'key2': 2, 'key3': 3},
        'repos': {'key1': 1, 'key2': 2, 'key3': 3},
        'accounts': {'key1': 1, 'key2': 2, 'key3': 3}
      }
      const dataStore = new ABCDataStore('./', testData)
      const folder = Object.keys(testData)[0]
      const key = Object.keys(testData[folder])[0]
      dataStore.removeKey(folder, key)
      const expected = ['key2', 'key3']
      const actual = dataStore.listKeys(folder)

      expect(actual).to.eql(expected)
    })

    it('should make no changes for non-existant folder', () => {
      const testData = {
        'logins': {'key1': 1, 'key2': 2, 'key3': 3},
        'repos': {'key1': 1, 'key2': 2, 'key3': 3},
        'accounts': {'key1': 1, 'key2': 2, 'key3': 3}
      }
      const dataStore = new ABCDataStore('./', testData)
      const folder = 'newFolder'
      const key = 'key1'
      const expected = dataStore
      dataStore.removeKey(folder, key)
      const actual = dataStore

      expect(actual).to.eql(expected)
    })

    it('should make no changes for non-existant key', () => {
      const testData = {
        'logins': {'key1': 1, 'key2': 2, 'key3': 3},
        'repos': {'key1': 1, 'key2': 2, 'key3': 3},
        'accounts': {'key1': 1, 'key2': 2, 'key3': 3}
      }
      const dataStore = new ABCDataStore('./', testData)
      const folder = Object.keys(testData)[0]
      const key = 'newKey'
      const expected = dataStore
      dataStore.removeKey(folder, key)
      const actual = dataStore

      expect(actual).to.eql(expected)
    })
  })

// abcWallet.dataStore.removeFolder(folder, callback)
  describe('removeFolder()', () => {
    it('should make no changes for a non-existant folder', () => {
      const testData = {
        'logins': {'key1': 1, 'key2': 2, 'key3': 3},
        'repos': {'key1': 1, 'key2': 2, 'key3': 3},
        'accounts': {'key1': 1, 'key2': 2, 'key3': 3}
      }
      const dataStore = new ABCDataStore('./', testData)
      const newFolder = 'newFolder'
      const expected = dataStore
      dataStore.removeFolder(newFolder)
      const actual = dataStore

      expect(actual).to.eql(expected)
    })

    it('should remove existing folder', () => {
      const testData = {
        'logins': {'key1': 1, 'key2': 2, 'key3': 3},
        'repos': {'key1': 1, 'key2': 2, 'key3': 3},
        'accounts': {'key1': 1, 'key2': 2, 'key3': 3}
      }
      const dataStore = new ABCDataStore('./', testData)
      const folder = Object.keys(testData)[0]
      dataStore.removeFolder(folder)
      const actual = Object.keys(dataStore.data)

      expect(actual).to.not.contain(folder)
    })
  })
})
