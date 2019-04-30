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
  let storyList = '', totalFeaturePoints = 0
  member.iteration_stories.forEach(story => {
    if (story.story_type === 'feature' && story.current_state === 'accepted')
      totalFeaturePoints += story.estimate
    storyList += `
    <li><a href="${story.url}">${story.name} (is <b>${story.current_state}</b>)</a>
      <p>Took ${story.iteration_details.started_count === 0 ? 0 : getHoursFromSeconds(story.iteration_details.total_cycle_time)} hours</p>
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
  <h4>Number of stories attempted: ${ member.iteration_stories.length } (${storyCount.feature} features, ${storyCount.chore} chores, ${storyCount.bug} bugs)</h4>
  <h4>Stories Attempted:</h4>
  <ul>${storyList}</ul>
  <h5>Total Points: ${totalFeaturePoints}</h5>
</div>
`)
}
