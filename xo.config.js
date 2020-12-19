/** @typedef {import("xo").Options} XoOptions */

/** @type {import("@yoursunny/xo-config")} */
const { babel, js, merge } = require("@yoursunny/xo-config");

/** @type {XoOptions} */
module.exports = merge(babel, js);
