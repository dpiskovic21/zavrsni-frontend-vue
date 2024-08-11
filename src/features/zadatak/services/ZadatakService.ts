import axios, { type AxiosInstance } from "axios";
import { config } from "@/shared/Config";
import type {
  Zadatak,
  CreateZadatakDTO,
  UpdateZadatakDTO,
} from "../interfaces";

export class ZadatakService {
  private apiClient: AxiosInstance;
  constructor() {
    this.apiClient = axios.create({
      baseURL: `${config.apiURL}/zadatak`,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async getZadatci() {
    const response = await this.apiClient.get<Zadatak[]>("/");
    return response.data;
  }

  async getZadatak(id: number) {
    const response = await this.apiClient.get<Zadatak>(`/${id}`);
    return response.data;
  }

  async postZadatak(zadatak: CreateZadatakDTO) {
    const response = await this.apiClient.post<Zadatak>("/", zadatak);
    return response.data;
  }

  async updateZadatak(id: number, updateZadatakDTO: UpdateZadatakDTO) {
    const response = await this.apiClient.patch<Zadatak>(
      `/${id}`,
      updateZadatakDTO
    );
    return response.data;
  }

  async deleteZadatak(id: string) {
    const response = await this.apiClient.delete<Zadatak>(`/${id}`);
    return response.data;
  }
}
