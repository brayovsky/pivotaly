module.exports = members => {
  const memberById = {}
  members.forEach(member => {
    memberById[member.person.id] = member
    member.iteration_stories = []
  })
  return memberById
}
