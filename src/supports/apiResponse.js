class APIResponse {
  constructor(data = undefined, statusCode = 200, message = "success") {
    this.data = data;
    this.statusCode = statusCode;
    this.message = message;
  }

  static created(data) {
    return new APIResponse(data, 201, "created");
  }

  static success(data = undefined) {
    return new APIResponse(data, 200, "success");
  }

  static noContent() {
    return new APIResponse(null, 204, "no content");
  }

  setMessage(message) {
    this.message = message;
    return this;
  }

  setStatusCode(status) {
    this.statusCode = status;
    return this;
  }

  render() {
    let finalOutput;

    if (this.data && typeof this.data.toJSON === "function") {
      finalOutput = this.data.toJSON(); // mongoose doc → plain object
    } else if (Array.isArray(this.data)) {
      finalOutput = { rows: this.data, count: this.data.length };
    } else {
      finalOutput = this.data ?? null;
    }

    return {
      success: this.statusCode >= 200 && this.statusCode < 300,
      statusCode: this.statusCode,
      message: this.message,
      serverTime: new Date(),
      data: finalOutput,
    };
  }

  renderResponse(res) {
    res.status(this.statusCode).json(this.render());
  }
}

module.exports = { APIResponse };
