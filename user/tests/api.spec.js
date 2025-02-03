const request = require("supertest");
const bodyParser = require('body-parser');
const app = require("../index");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

describe("Api notification test suite", () => {
    it("tests /users endpoints", async () => {
        const test_user = {
            id: Date.now(), 
            username: "Justin Shine",
            email: "justin@shine.com"
        };

        const response = await request(app).post("/users")
            .send(test_user)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

        expect(response.statusCode).toBe(201);
    });

    it('should respond with 400 status when no data is provided', async () => {
        const response = await request(app)
            .post('/users')
            .send({}); // Empty request body

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            message: 'Request body cannot be empty.',
        });
    });
});