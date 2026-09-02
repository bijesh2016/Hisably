class ApiResponse {
  constructor(statusCode, data, message = 'Success') {
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'success';
    this.message = message;
    this.data = data;
  }

  static success(data, message = 'Success') {
    return new ApiResponse(200, data, message);
  }

  static created(data, message = 'Resource created successfully') {
    return new ApiResponse(201, data, message);
  }

  static noContent(message = 'Resource deleted successfully') {
    return new ApiResponse(204, null, message);
  }
}

module.exports = ApiResponse;
