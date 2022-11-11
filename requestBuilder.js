function requestRebuilder(serviceName, path, method, data) {
  try {
    let url;
    switch (process.env.NODE_ENV) {
      case "development":
        url = "/api-gateway/";
        break;
      case "test":
        url = "/api-gateway-test/";
        break;
      case "pre-production":
        url = "/api-gateway-pre-production/";
        break;
      case "production":
        url = "/api-gateway-production/";
        break;
      default:
        url = "/api-gateway-local/";
    }

    let config = {
      method: "post",
      url: url,
      headers: {
        "requsted-service": serviceName,
        "requsted-path": path,
        "requsted-method": method,
      },
      data: data,
    };

    // return await this.$axios(json)
    return config;
  } catch (error) {
    return error;
  }
}
module.exports = requestRebuilder;
