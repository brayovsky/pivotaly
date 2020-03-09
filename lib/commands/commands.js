exports.commands = {
  storyState: {
    startStory: "pivotaly.startStory",
    stopStory: "pivotaly.stopStory",
    finishStory: "pivotaly.finishStory",
    deliverStory: "pivotaly.deliverStory",
    refreshStateView: 'pivotaly.refreshStateView',
    refreshMemberCycleView: 'pivotaly.refreshMemberCycleView',
    refreshBacklog: 'pivotaly.refreshBacklog',
    deliverTask: 'pivotaly.deliverTask',
    addBlocker: 'pivotaly.addBlocker',
    addTask: 'pivotaly.addTask',
    unDeliverTask: 'pivotaly.unDeliverTask',
    resolveBlocker: 'pivotaly.resolveBlocker',
    unResolveBlocker: 'pivotaly.unResolveBlocker',
    showStoryDescription: 'pivotaly.showStoryDescription',
    estimateStory: 'pivotaly.estimateStory'
  },
  workState: {
    linkStory: "pivotaly.linkStory"
  },
  statistics: {
    cycleTime: "pivotaly.cycleTime"
  },
  internal: {
    showCommandsQuickPick: "pivotaly.showCommandQuickPick",
    registerToken: "pivotaly.registerToken",
    registerProjectID: "pivotaly.registerProjectID",
    reinstateWorkspace: "pivotaly.reinstateWorkspace",
    copyToClipboard: "pivotaly.copy"
  }
}
