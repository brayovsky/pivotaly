const {refreshState} = require('../helpers/pivotaly')

module.exports = async (context, dataProvider) => {
  await refreshState(context)
  dataProvider.refresh()
}
