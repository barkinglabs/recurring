'use strict'

const RecurlyData = require('../recurly-data')
const _ = require('lodash')
const handleRecurlyError = require('../util').handleRecurlyError
const data2xml = require('data2xml')({
  undefined: 'empty',
  null: 'closed'
})
const debug = require('debug')('recurring')

class GiftCard extends RecurlyData {
  constructor(recurring) {
    super({
      recurring,
      properties: [
        'gifter_account',
        'invoice',
        'recipient_account',
        'redemption_code',
        'balance_in_cents',
        'currency',
        'product_code',
        'unit_amount_in_cents',
        'delivery',
        'method',
        'deliver_at',
        'email_address',
        'first_name',
        'last_name',
        'address',
        'address1',
        'address2',
        'city',
        'state',
        'zip',
        'country',
        'phone',
        'gifter_name',
        'personal_message',
        'created_at',
        'updated_at',
        'delivered_at',
        'redeemed_at',
        'uuid',
        'id',
      ],
      idField: 'id',
      plural: 'gift_cards',
      singular: 'gift_card',
      enumerable: true
    })
  }

  static get SINGULAR() {
    return 'gift_card'
  }

  static get PLURAL() {
    return 'gift_cards'
  }

  static get ENDPOINT() {
    return `${RecurlyData.ENDPOINT}${GiftCard.PLURAL}`
  }

  create(options, callback) {
    const body = data2xml(GiftCard.SINGULAR, options)
    this.post(GiftCard.ENDPOINT, body, (err, response, payload) => {
      const error = handleRecurlyError(err, response, payload, [ 200, 201, 204 ])
      if (error) {
        return callback(error)
      }

      this.inflate(payload)
      callback(null, this)
    })
  }

  fetchPurchaseInvoice(callback) {
    if (!this._resources.purchase_invoice) {
      throw new Error('No purchase_invoice resource available')
    }

    const invoice = this._recurring.Invoice()
    invoice.href = this._resources.purchase_invoice

    invoice.fetch(callback)
  }
}

module.exports = GiftCard
