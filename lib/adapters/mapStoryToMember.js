const _ = require('lodash')

module.exports = (members, stories) => {
  _.forEach(stories, (story) => {
    story.owner_ids.forEach(ownerId => {
      members[ownerId].iteration_stories.push(story)
    })
  })
}
