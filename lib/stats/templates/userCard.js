const getHoursFromSeconds = seconds => Math.trunc(seconds/36e5)

module.exports = member => {
  let storyList = ''
  member.iteration_stories.forEach(story => {
    storyList += `
    <li><a href="${story.url}">${story.name} (is <b>${story.current_state}</b>)</a>
      <p>Took ${getHoursFromSeconds(story.iteration_details.total_cycle_time)} hours</p>
      <ul>
        <li><i>Started ${story.iteration_details.started_count} times (${getHoursFromSeconds(story.iteration_details.started_time)} hours)</i></li>
        <li><i>Finished ${story.iteration_details.finished_count} times (${getHoursFromSeconds(story.iteration_details.finished_time)} hours)</i></li>
        <li><i>Delivered ${story.iteration_details.delivered_count} times (${getHoursFromSeconds(story.iteration_details.delivered_time)} hours)</i></li>
        <li><i>Rejected ${story.iteration_details.rejected_count} times (${getHoursFromSeconds(story.iteration_details.rejected_time)} hours)</i></li>
      </ul>
    </li>
    <br>`
  })

  return `
<div class="card">
  <h1>${member.person.name}</h1>
  <h4>Number of stories attempted: ${ member.iteration_stories.length }</h4>
  <h4>Stories Attempted:</h4>
  <ul>${storyList}</ul>
</div>
`
}
