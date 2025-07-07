/**
 * Represents a monetary adjustment (discount or extra charge).
 */
class Adjustment {
  /**
   * @param {string} note - A brief description of the adjustment.
   * @param {number} value - The numeric value of the adjustment.
   * @param {Object} type - The type of adjustment (DISCOUNT or EXTRA_CHARGE).
   */
  constructor(note, value, type) {
    this._note = note;
    this._value = value;
    this._type = type;
  }

  /** 
   * Get the adjustment note (description).
   * @returns {string}
   */
  get note() {
    return this._note;
  }

  /**
   * Set the adjustment note (description).
   * @param {string} val
   */
  set note(val) {
    this._note = val;
  }

  /**
   * Get the adjustment value.
   * @returns {number}
   */
  get value() {
    return this._value;
  }

  /**
   * Set the adjustment value.
   * @param {number} val
   */
  set value(val) {
    this._value = val;
  }

  /**
   * Get the adjustment type.
   * @returns {Object}
   */
  get type() {
    return this._type;
  }

  /**
   * Set the adjustment type.
   * @param {Object} val
   */
  set type(val) {
    this._type = val;
  }
}
