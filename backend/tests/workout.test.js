const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const connectDB = require("../config/db");
const Workout = require("../models/workoutModel");

const api = supertest(app);

const workouts = [
    {
        title: "Press Pull Legs",
        difficulty: "Beginner",
        description: "You press and pull your legs in a workout",
        price: 67.99,
    },
    {
        title: "Upper Lower",
        difficulty: "Advanced",
        description: "One day you upper second say you lower - stefan 2026",
        price: 67.99,
    },
];

beforeAll(async () => {
    await connectDB();
});

describe("Workout Controller", () => {
    beforeEach(async () => {
        await Workout.deleteMany({});
        await Workout.insertMany(workouts);
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    // Test GET /api/workouts
    describe("GET /api/workouts", () => {
        it("should return all workouts", async () => {
            const response = await api.get("/api/workouts").expect(200);

            expect(response.body).toHaveLength(workouts.length);
        });

        it("should return workouts as JSON with status 200", async () => {
            await api
                .get("/api/workouts")
                .expect(200)
                .expect("Content-Type", /application\/json/);
        });

        it("should include a specific workout in the returned list", async () => {
            const response = await api.get("/api/workouts");

            expect(response.body.map((workout) => workout.title)).toContain(
                "Press Pull Legs"
            );
        });
    });

    // Test POST /api/workouts
    describe("POST /api/workouts", () => {
        describe("when the payload is valid", () => {
            it("should return status 201", async () => {
                const newWorkout = {
                    title: "Press Pull Legs",
                    difficulty: "Beginner",
                    description: "You press and pull your legs in a workout",
                    price: 67.99,
                };

                await api.post("/api/workouts").send(newWorkout).expect(201);
            });

            it("should persist the new workout in the database", async () => {
                const newWorkout = {
                    title: "Press Pull Legs",
                    difficulty: "Beginner",
                    description: "You press and pull your legs in a workout",
                    price: 67.99,
                };

                await api.post("/api/workouts").send(newWorkout).expect(201);

                const workoutsAfterPost = await Workout.find({});
                expect(workoutsAfterPost).toHaveLength(workouts.length + 1);
                expect(workoutsAfterPost.map((workout) => workout.title)).toContain(newWorkout.title);
            });
        });

        describe("when the payload is invalid", () => {
            it("should return status 400 when title is missing", async () => {
                const invalidWorkout = {
                    difficulty: "Beginner",
                    description: "Missing title should fail.",
                    price: 67.99,
                };

                await api.post("/api/workouts").send(invalidWorkout).expect(400);
            });


            it("should not increase the number of workouts in the database", async () => {
                const invalidWorkout = {
                    difficulty: "Beginner",
                    description: "Missing title should fail.",
                    price: 67.99,
                };

                await api.post("/api/workouts").send(invalidWorkout).expect(400);

                const workoutsAtEnd = await Workout.find({});
                expect(workoutsAtEnd).toHaveLength(workouts.length);
            });
        });
    });

    // Test GET /api/workouts/:id
    describe("GET /api/workouts/:workoutId", () => {
        describe("when the id is valid", () => {
            it("should return one workout by ID", async () => {
                const workout = await Workout.findOne();

                const response = await api
                    .get(`/api/workouts/${workout._id}`)
                    .expect(200)
                    .expect("Content-Type", /application\/json/);

                expect(response.body.title).toBe(workout.title);
            });
        });

        describe("when the id does not exist", () => {
            it("should return status 404", async () => {
                const nonExistentId = new mongoose.Types.ObjectId();

                await api.get(`/api/workouts/${nonExistentId}`).expect(404);
            });
        });

        describe("when the id is invalid", () => {
            it("should return status 404", async () => {
                await api.get("/api/workouts/12345").expect(404);
            });
        });
    });

    // Test PUT /api/workouts/:id
    describe("PUT /api/workouts/:workoutId", () => {
        describe("when the id is valid", () => {
            it("should return status 200", async () => {
                const workout = await Workout.findOne();

                await api
                    .put(`/api/workouts/${workout._id}`)
                    .send({ description: "Updated description", price: 99.99 })
                    .expect(200);
            });

            it("should persist the updated fields in the database", async () => {
                const workout = await Workout.findOne();
                const updates = {
                    description: "Updated description",
                    price: 99.99,
                };

                await api.put(`/api/workouts/${workout._id}`).send(updates).expect(200);

                const updatedWorkout = await Workout.findById(workout._id);
                expect(updatedWorkout.description).toBe(updates.description);
                expect(updatedWorkout.price).toBe(updates.price);
            });
        });

        describe("when the id is invalid", () => {
            it("should return status 400", async () => {
                await api.put("/api/workouts/12345").send({}).expect(400);
            });
        });
    });

    // Test DELETE /api/workouts/:id
    describe("DELETE /api/workouts/:workoutId", () => {
        describe("when the id is valid", () => {
            it("should return status 204", async () => {
                const workout = await Workout.findOne();

                await api.delete(`/api/workouts/${workout._id}`).expect(204);
            });

            it("should remove the workout from the database", async () => {
                const workout = await Workout.findOne();

                await api.delete(`/api/workouts/${workout._id}`).expect(204);

                const deletedWorkout = await Workout.findById(workout._id);
                expect(deletedWorkout).toBeNull();
            });
        });

        describe("when the id is invalid", () => {
            it("should return status 404", async () => {
                await api.delete("/api/workouts/12345").expect(404);
            });
        });
    });
});