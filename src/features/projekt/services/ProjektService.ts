import axios, { type AxiosInstance } from "axios";
import { config } from "@/shared/Config";
import type {
  CreateProjektDTO,
  Projekt,
  UpdateProjektDTO,
} from "../interfaces";
import type { Statistika } from "@/features/statistika/interfaces";

export class ProjektService {
  private apiClient: AxiosInstance;
  constructor() {
    this.apiClient = axios.create({
      baseURL: `${config.apiURL}/projekt`,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async createProjekt(dto: CreateProjektDTO) {
    const response = await this.apiClient.post("/", dto);
    return response.data;
  }

  async getProjekti(): Promise<Projekt[]> {
    const response = await this.apiClient.get("/");
    return response.data;
  }

  async getProjekt(id: string): Promise<Projekt> {
    const response = await this.apiClient.get(`/${id}`);
    return response.data;
  }

  async getProjektStatistika(id: number, datum: Date | null = null) {
    let datumQuery = "";
    if (datum) {
      datumQuery = `?datum=${datum.toISOString()}`;
    }

    const response = await this.apiClient.get<Statistika>(
      `/${id}/statistika${datumQuery}`
    );
    return response.data;
  }

  async deleteProjekt(id: string) {
    const response = await this.apiClient.delete(`/${id}`);
    return response.data;
  }

  async updateProjekt(id: number, dto: UpdateProjektDTO) {
    const response = await this.apiClient.patch(`/${id}`, dto);
    return response.data;
  }
}
