const Chance = require('chance')
const Context = require('../../test/factories/vscode/context')

const context = Context.build()

describe('#git', () => {
  beforeEach(() => {
    jest.resetModules();
  })

  describe('getActiveBranch', () => {
    test('should use simpleGit\'s branchLocal method and resolve to the current branch', async () => {
      jest.doMock('simple-git', () => () => ({
        branchLocal: jest.fn(cb => cb(null, {
          current: 'branch'
        }))
      }))
      const {getActiveBranch} = require('./git')
      const activeBranch = await getActiveBranch()
      expect(activeBranch).toBe('branch')
    })

    test('should reject with simple git\'s error if getting branch fails', async () => {
      jest.doMock('simple-git', () => () => ({
        branchLocal: jest.fn(cb => cb('err'))
      }))
      const {getActiveBranch} = require('./git')
      expect(getActiveBranch()).rejects.toBe('err')
    })
  })

  describe('getAllBranches', () => {
    test('should use simpleGit\'s branchLocal method and resolve to the all property', async () => {
      jest.doMock('simple-git', () => () => ({
        branchLocal: jest.fn(cb => cb(null, {
          current: 'branch',
          all: ['branch-2', 'branch']
        }))
      }))
      const {getAllBranches} = require('./git')
      const allBranches = await getAllBranches()
      expect(allBranches).toMatchObject(['branch-2', 'branch'])
    })

    test('should reject with simple git\'s error if getting all branches fails', async () => {
      jest.doMock('simple-git', () => () => ({
        branchLocal: jest.fn(cb => cb('err'))
      }))
      const {getAllBranches} = require('./git')
      expect(getAllBranches()).rejects.toBe('err')
    })
  })

  describe('listenForCheckout', () => {
    let listenForCheckOut

    beforeAll(() => {
      jest.useFakeTimers()
    })

    beforeEach(() => {
      jest.doMock('simple-git', () => () => ({
        branchLocal: jest.fn(cb => cb(null, {
          current: new Chance().string(),
          all: ['branch-2', 'branch']
        }))
      }))
      listenForCheckOut = require('./git').listenForCheckOut
      context.workspaceState.get = jest.fn(() => false)
    })

    afterEach(() => {
      jest.clearAllTimers()
      jest.clearAllMocks()
    })

    test('should not attempt to listen for checkout if workspace is not a pivotal project', async () => {
      context.workspaceState.get = jest.fn(() => true)
      await listenForCheckOut(context, () => {})
      expect(setInterval).not.toHaveBeenCalled()
    })

    test('should check branch every 2 seconds', async () => {
      await listenForCheckOut(context, () => {})
      expect(setInterval).toHaveBeenCalledTimes(1)
      expect(setInterval.mock.calls[0][1]).toBe(2000)
    })

    test('should call callback with supplied arguments after a branch change', async () => {
      const callback = jest.fn(() => {})
      await listenForCheckOut(context, callback, 1, 2)
      jest.runOnlyPendingTimers()
      /**
       * Wait for promise inside timer function to resolve
       * Seems to be the only work around
       */
      await Promise.resolve(3)
      expect(callback).toHaveBeenCalledTimes(1)
      expect(callback).toBeCalledWith(1, 2)
    })
  })

  describe('checkoutFromBranch', () => {
    let checkoutFromBranch

    beforeAll(() => {
      jest.useFakeTimers()
    })

    beforeEach(() => {
      jest.doMock('simple-git', () => () => ({
        branchLocal: jest.fn(cb => cb(null, {
          current: new Chance().string(),
          all: ['branch-2', 'branch']
        })),
        checkoutBranch: jest.fn((newBranch, base, cb) => cb(null, 'success'))
      }))
      checkoutFromBranch = require('./git').checkoutFromBranch
      context.workspaceState.get = jest.fn(() => true)
    })

    afterEach(() => {
      jest.clearAllTimers()
      jest.clearAllMocks()
    })

    test('should clear any interval initially set', async () => {
      const {listenForCheckOut} = require('./git')
      context.workspaceState.get = jest.fn(() => false)
      await listenForCheckOut(context, jest.fn())
      await checkoutFromBranch(context, 'new', 'old', jest.fn())
      expect(clearInterval).toHaveBeenCalled()
    })

    test('should use simpleGit\'s checkoutBranch method and resolve to data returned', async () => {
      const checkout = await checkoutFromBranch(context, 'new', 'old', jest.fn())
      expect(checkout).toBe('success')
    })

    test('should call listenForCheckout after a successful or unsuccessful checkout', async () => {
      context.workspaceState.get = jest.fn(() => false)
      await checkoutFromBranch(context, 'new', 'old', jest.fn())
      expect(setInterval).toHaveBeenCalledTimes(1)
      jest.clearAllMocks()
      jest.doMock('simple-git', () => () => ({
        checkoutBranch: jest.fn((newBranch, base, cb) => cb('err'))
      }))
      checkoutFromBranch = require('./git').checkoutFromBranch
      await checkoutFromBranch(context, 'new', 'old', jest.fn())
      expect(setInterval).toHaveBeenCalledTimes(1)
    })

    test('should not reject with error if checkout was unsuccessful', async () => {
      jest.doMock('simple-git', () => () => ({
        checkoutBranch: jest.fn((newBranch, base, cb) => cb('err'))
      }))
      checkoutFromBranch = require('./git').checkoutFromBranch
      expect(checkoutFromBranch(context, 'new', 'old', jest.fn())).rejects.toBe('err')
    })
  })
})
