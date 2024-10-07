import { beforeEach, describe, expect, it } from "vitest";
import { RegisterUseCase } from "./register";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repositosy";
import { CreateGymUseCase } from "./create-gym";

// const gymsRepository = new InMemoryUsersRepository();
// const registerUseCase = new RegisterUseCase(gymsRepository);

let gymsRepository: InMemoryGymsRepository;
let sut: CreateGymUseCase;

describe("Register Use Case", () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new CreateGymUseCase(gymsRepository);
  });

  it("should be able to register", async () => {
    const { gym } = await sut.execute({
      title: "Javascript Gym",
      description: null,
      latitude: -10.7399757,
      longitude: -37.811244,
      phone: null,
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
