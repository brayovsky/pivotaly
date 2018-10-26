const {Model} = require('../')

class PtAccounts extends Model {
  constructor(context) {
    super(context)
  }

  get endpoints() {
    return {
      getMemberships: `${this._baseApiPath}/memberships`
    }
  }

  getMemberships() {
    return this._fetch('get', this.endpoints.getMemberships)
  }
}

module.exports = PtAccounts
