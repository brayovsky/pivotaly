const {getPlural} = require('../../utils/generalUtils')

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
    
    if(isFeature) totalAssignedPoints += story.estimate
    if(isAcceptedFeature) totalFeaturePoints += story.estimate
    
    const estimateHours = story.iteration_details.started_count === 0 ? 0 : getHoursFromSeconds(story.iteration_details.total_cycle_time)
    const startedHours = getHoursFromSeconds(story.iteration_details.started_time)
    const finishedHours = getHoursFromSeconds(story.iteration_details.finished_time)
    const deliveredHours = getHoursFromSeconds(story.iteration_details.delivered_time)
    const rejectedHours = getHoursFromSeconds(story.iteration_details.rejected_time)

    storyList += `
    <li><a href="${story.url}">${story.name} (is <b>${story.current_state}</b>)</a>
      <p>${story.estimate ? story.estimate : '0'} ${getPlural('point', story.estimate)} took ${estimateHours} ${getPlural('hour', estimateHours)}</p>
      <ul>
        <li><i>Started ${story.iteration_details.started_count} ${getPlural('time', story.iteration_details.started_count)} (${startedHours} ${getPlural('hour', startedHours)})</i></li>
        <li><i>Finished ${story.iteration_details.finished_count} ${getPlural('time', story.iteration_details.finished_count)} (${finishedHours} ${getPlural('hour', finishedHours)})</i></li>
        <li><i>Delivered ${story.iteration_details.delivered_count} ${getPlural('time', story.iteration_details.delivered_count)} (${deliveredHours} ${getPlural('hour', deliveredHours)})</i></li>
        <li><i>Rejected ${story.iteration_details.rejected_count} ${getPlural('time', story.iteration_details.rejected_count)} (${rejectedHours} ${getPlural('hour', rejectedHours)})</i></li>
      </ul>
    </li>
    <br>`
  })
  
  const storyCount = countStoryTypes(member.iteration_stories)
  return (
`<div class="card">
  <h1>${member.person.name}</h1>
  <h4>${ member.iteration_stories.length } ${getPlural('story', member.iteration_stories.length)} attempted: ${storyCount.feature} ${getPlural('feature', storyCount.feature)}, ${storyCount.chore} ${getPlural('chore', storyCount.chore)}, ${storyCount.bug} ${getPlural('bug', storyCount.bug)}</h4>
  <h4>Total Points Assigned: ${totalAssignedPoints}</h5>
  <h4>Total Points Completed: ${totalFeaturePoints}</h5>
  <h4>${storyList.length ? 'Stories Attempted:' : ''}</h4>
  <ul>${storyList}</ul>
</div>
`)
}
