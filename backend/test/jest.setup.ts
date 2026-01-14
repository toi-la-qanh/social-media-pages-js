process.env.NODE_ENV = "test";
process.env.TOKEN_KEY = process.env.TOKEN_KEY || "test-secret";
// Keep tests simple: always run the test server on port 5000
process.env.PORT = "5000";


