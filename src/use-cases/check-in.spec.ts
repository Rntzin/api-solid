import { beforeEach, describe, expect, it, vi, afterEach } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { CheckInUseCase } from "./check-in";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repositosy";
import { Decimal } from "@prisma/client/runtime/library";
import { MaxNumberOfCheckInsError } from "./errors/max-number-of-check-ins";
import { MaxDistanceError } from "./errors/max-distance-error";

// const usersRepository = new InMemoryUsersRepository();
// const registerUseCase = new RegisterUseCase(usersRepository);

let checkInsRepository: InMemoryCheckInsRepository;
let sut: CheckInUseCase;
let gymsRepository: InMemoryGymsRepository;

describe("Check-in Use Case", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(checkInsRepository, gymsRepository);

    await gymsRepository.create({
      id: "gym-01",
      title: "Javascript Gym",
      description: "",
      latitude: -10.7399757,
      longitude: -37.811244,
      phone: "",
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to check in", async () => {
    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -10.7399757,
      userLongitude: -37.811244,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in twice in the same day", async () => {
    vi.setSystemTime(new Date(2024, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -10.7399757,
      userLongitude: -37.811244,
    });

    await expect(() =>
      sut.execute({
        gymId: "gym-01",
        userId: "user-01",
        userLatitude: -10.7399757,
        userLongitude: -37.811244,
      })
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
  });
  it("should be able to check in", async () => {
    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -10.7399757,
      userLongitude: -37.811244,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should be able to check in twice but in different days", async () => {
    vi.setSystemTime(new Date(2024, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -10.7399757,
      userLongitude: -37.811244,
    });
    vi.setSystemTime(new Date(2024, 0, 21, 8, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -10.7399757,
      userLongitude: -37.811244,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in on distant gym", async () => {
    gymsRepository.items.push({
      id: "gym-02",
      title: "Javascript Gym",
      description: "",
      latitude: new Decimal(-10.601303),
      longitude: new Decimal(-37.5395275),
      phone: "",
    });

    await expect(() =>
      sut.execute({
        gymId: "gym-02",
        userId: "user-01",
        userLatitude: -10.7399757,
        userLongitude: -37.811244,
      })
    ).rejects.toBeInstanceOf(MaxDistanceError);
  });
});
