// Define a class named ApiResponse
class ApiResponse {
    // Constructor function for creating instances of the class
    constructor(statusCode, message = "success", data) {
        // Instance variables to store the properties of the API response
        this.statusCode = statusCode;   // HTTP status code of the response
        this.data = data;               // Data payload of the response
        this.message = message;         // Optional message associated with the response
        this.success = statusCode < 400; // Boolean indicating whether the response is successful (status code < 400)
    }
}

// Export the ApiResponse class to make it accessible in other modules
export { ApiResponse };