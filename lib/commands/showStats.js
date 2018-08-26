const {model} = require('../../model')

module.exports = async (context) => {
  const iteration = await model.getIterationCycleTime(context, 4)
  console.log(iteration)
}
