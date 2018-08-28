module.exports = (stories, iterationCycle) =>
  iterationCycle.forEach(cycleDetails => {
    if(stories[cycleDetails.story_id])
      stories[cycleDetails.story_id].iteration_details = cycleDetails
  })
