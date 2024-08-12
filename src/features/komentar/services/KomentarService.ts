import axios, { type AxiosInstance } from "axios";
import { config } from "@/shared/Config";
import type { CreateKomentarDTO, Komentar } from "../interfaces";

export class KomentarService {
  private apiClient: AxiosInstance;
  constructor() {
    this.apiClient = axios.create({
      baseURL: `${config.apiURL}/komentar`,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async getKomentari() {
    const response = await this.apiClient.get<Komentar[]>("");
    return response.data;
  }

  async postKomenatar(dto: CreateKomentarDTO) {
    const response = await this.apiClient.post<Komentar>("", dto);
    return response.data;
  }

  async deleteKomentar(id: string) {
    const response = await this.apiClient.delete(`${id}`);
    return response.data;
  }
}
