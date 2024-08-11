import axios, { type AxiosInstance } from "axios";
import { config } from "@/shared/Config";
import type { Projekt, UpdateProjektDTO } from "../interfaces";

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

  //   createProjekt(dto: CreateProjektDTO) {
  //     return this.http.post(this.url, dto);
  //   }

  async getProjekti(): Promise<Projekt[]> {
    const response = await this.apiClient.get("/");
    console.log(response);
    return response.data;
  }

  async getProjekt(id: number): Promise<Projekt> {
    const response = await this.apiClient.get(`/${id}`);
    return response.data;
  }

  //   getProjektStatistika(id: number, datum: Date | null = null) {
  //     let datumQuery = '';
  //     if (datum) {
  //       datumQuery = `?datum=${datum.toISOString()}`;
  //     }
  //     return this.http.get<ProjektStatistika>(
  //       `${this.url}/${id}/statistika${datumQuery}`
  //     );
  //   }

  async deleteProjekt(id: string) {
    const response = await this.apiClient.delete(`/${id}`);
    return response.data;
  }

  async updateProjekt(id: number, dto: UpdateProjektDTO) {
    const response = await this.apiClient.patch(`/${id}`, dto);
    return response.data;
  }
}
