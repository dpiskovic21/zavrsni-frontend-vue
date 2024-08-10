import axios, { type AxiosInstance } from "axios";
import { config } from "@/shared/Config";
import type { PrijavaDTO } from "../interfaces";

export class AutorizacijaService {
  private apiClient: AxiosInstance;
  constructor() {
    this.apiClient = axios.create({
      baseURL: `${config.apiURL}/autorizacija`,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async prijava(dto: PrijavaDTO) {
    const response = await this.apiClient.post("/prijava", dto);
    return response.data;
  }
}
