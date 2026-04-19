const normalizeUrl = (value = "") => String(value).trim().replace(/\/+$/, "");

module.exports = {
  normalizeUrl,
};
