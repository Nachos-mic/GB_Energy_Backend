import axios from "axios";
import EnergyInfoService from "../services/energyInfo.service";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("EnergyInfoService", () => {
    let service: EnergyInfoService;

    beforeEach(() => {
        service = new EnergyInfoService();
        jest.clearAllMocks();
    });

    //Test dla getGenerationMixData
    it("Test poprawności pól zwróconych przez getGenerationMixData", async () => {
        mockedAxios.get.mockResolvedValueOnce({
            data: {
                data: [
                    {
                        from: "2026-01-11T10:00:00Z",
                        to: "2026-01-11T10:30:00Z",
                        generationmix: [
                            { fuel: "wind", perc: 40 },
                            { fuel: "solar", perc: 20 },
                        ],
                    },
                ],
            },
        });

        const result = await service.getGenerationMixData();

        expect(Array.isArray(result)).toBe(true);
        expect(result[0]).toHaveProperty("date");
        expect(result[0]).toHaveProperty("averageFuelUsage");
        expect(result[0]).toHaveProperty("totalCleanEnergyPercentage");
    });

    //Testy dla calculateBestTimeWindow
    it("Test dla hours > 6", async () => {
        await expect(service.calculateBestTimeWindow("7")).rejects.toThrow(
            "Okno czasowe musi być ustalone pomiędzy 1 a 6"
        );
    });

    it("Test liczenia okna czasowego", async () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(10, 0, 0, 0);

        mockedAxios.get.mockResolvedValueOnce({
            data: {
                data: [
                    {
                        from: tomorrow.toISOString(),
                        to: new Date(tomorrow.getTime() + 30 * 60000).toISOString(),
                        generationmix: [{ fuel: "wind", perc: 50 }],
                    },
                    {
                        from: new Date(tomorrow.getTime() + 30 * 60000).toISOString(),
                        to: new Date(tomorrow.getTime() + 60 * 60000).toISOString(),
                        generationmix: [{ fuel: "wind", perc: 60 }],
                    },
                ],
            },
        });

        const result = await service.calculateBestTimeWindow("1");

        expect(result).toHaveProperty("start");
        expect(result).toHaveProperty("end");
        expect(result).toHaveProperty("percentage");
        expect(typeof result.percentage).toBe("number");
    });
});
