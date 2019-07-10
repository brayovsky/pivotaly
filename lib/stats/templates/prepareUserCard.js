const getHoursFromSeconds = seconds => Math.trunc(seconds/36e5)

const countStoryTypes = stories => {
  const storyCounts = {
    feature: 0,
    bug: 0,
    chore: 0,
    release: 0
  }
  stories.forEach(story => {
    ++storyCounts[story.story_type]
  })

  return storyCounts
}



module.exports = member => {
  let storyList = '', totalFeaturePoints = 0, totalAssignedPoints = 0
  member.iteration_stories.forEach(story => {
    const isFeature = story.story_type === 'feature'
    const isAcceptedFeature = isFeature && story.current_state === 'accepted'
    if(isFeature) {
      totalAssignedPoints += story.estimate
      if(isAcceptedFeature) {
        totalFeaturePoints += story.estimate
      }
    }
    storyList += `
    <li><a href="${story.url}">${story.name} (is <b>${story.current_state}</b>)</a>
      <p>${story.estimate ? story.estimate : '0'} points took ${story.iteration_details.started_count === 0 ? 0 : getHoursFromSeconds(story.iteration_details.total_cycle_time)} hours</p>
      <ul>
        <li><i>Started ${story.iteration_details.started_count} times (${getHoursFromSeconds(story.iteration_details.started_time)} hours)</i></li>
        <li><i>Finished ${story.iteration_details.finished_count} times (${getHoursFromSeconds(story.iteration_details.finished_time)} hours)</i></li>
        <li><i>Delivered ${story.iteration_details.delivered_count} times (${getHoursFromSeconds(story.iteration_details.delivered_time)} hours)</i></li>
        <li><i>Rejected ${story.iteration_details.rejected_count} times (${getHoursFromSeconds(story.iteration_details.rejected_time)} hours)</i></li>
      </ul>
    </li>
    <br>`
  })
  
  const storyCount = countStoryTypes(member.iteration_stories)
  return (
`<div class="card">
  <h1>${member.person.name}</h1>
  <h4>${ member.iteration_stories.length } stories attempted: ${storyCount.feature} features, ${storyCount.chore} chores, ${storyCount.bug} bug${storyCount.bug === 1 ? '' : 's'}</h4>
  <h4>Total Points Assigned: ${totalAssignedPoints}</h5>
  <h4>Total Points Completed: ${totalFeaturePoints}</h5>
  <h4>Stories Attempted:</h4>
  <ul>${storyList}</ul>
</div>
`)
}
