const CREATE_REGEXP = {
	author: /^[\w\s-\u4e00-\u9fa5]*$/,
	home: /^(?=^.{3,255}$)(http(s)?:\/\/)?(www\.)?[0-9A-Za-z][0-9A-Za-z-]{0,62}(\.[0-9A-Za-z][0-9A-Za-z-]{0,62})+(:\d+)*(\/\w+\.\w+)*([?&]\w+=\w*)*$/,
	keyword: /^[0-9A-Za-z\s\u4e00-\u9fa5]*$/,
	name: /^[0-9a-z][0-9a-z_-]*$/
};

module.exports = {
	CREATE_REGEXP
};