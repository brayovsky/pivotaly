const { commands } = require('./commands')

describe('#commands', () => {
  test('test different commands expected by pivotal tracker', () => {
    expect(commands.storyState.startStory).toEqual('pivotaly.startStory')
    expect(commands.storyState.stopStory).toEqual('pivotaly.stopStory')
    expect(commands.storyState.finishStory).toEqual('pivotaly.finishStory')
    expect(commands.storyState.deliverStory).toEqual('pivotaly.deliverStory')

    expect(commands.ptState.createStory).toEqual('pivotaly.createStory')
    expect(commands.workState.linkStory).toEqual('pivotaly.linkStory')
    expect(commands.internal.showCommandsQuickPick).toEqual('pivotaly.showCommandQuickPick')
  })
})