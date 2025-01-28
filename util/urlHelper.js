function addQueryParams(url, params) {
    const urlObj = new URL(url);  // Create a URL object
    Object.keys(params).forEach(key => {
      urlObj.searchParams.append(key, params[key]);
    });
    return urlObj.toString();  // Return the URL with the query parameters
};

module.exports = {
    addQueryParams,
}