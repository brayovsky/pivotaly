const {refreshState} = require('../helpers/state')

module.exports = async (context, dataProvider) => {
  await refreshState(context)
  dataProvider.refresh()
}
