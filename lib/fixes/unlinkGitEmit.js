const fs = require('fs')
const path = require('path')
const {common} = require('../commands/common')

/**
 * git-emit was a module added initially to raise events after every git-checkout
 * the module proved to be problematic as it overwrote all git hooks and made them
 * a symbolic link to its own hook file that raised events
 */
module.exports = (context, rootPath) => {
  if(context.workspaceState.get(common.globals.fixes.removeGitEmit)) return

  const gitHooksPath = path.join(rootPath, '.git', 'hooks')
  const gitHooks = fs.readdirSync(gitHooksPath)

  const removeGitEmitSymLink = filename => {
    const hookFile = path.join(gitHooksPath, filename)
    const fileStat = fs.lstatSync(hookFile)
    
    // is symlink and does not exist
    if(fileStat.isSymbolicLink() && !fs.existsSync(hookFile)) {
      fs.unlinkSync(hookFile)
      fs.closeSync(fs.openSync(hookFile, 'a', 0o755))
    }
  }

  gitHooks.forEach(removeGitEmitSymLink)

  const gitEmitPortFile = path.join(gitHooksPath, '.git-emit.port')
  if (fs.existsSync(gitEmitPortFile)) fs.unlinkSync(gitEmitPortFile)

  context.workspaceState.update(common.globals.fixes.removeGitEmit, true)
}
