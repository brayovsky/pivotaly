module.exports = (stories, iterationCycle) =>
  iterationCycle.forEach(cycleDetails =>
    stories[cycleDetails.story_id].iteration_details = cycleDetails
  )
