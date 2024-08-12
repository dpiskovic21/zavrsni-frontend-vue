import axios, { type AxiosInstance } from "axios";
import { config } from "@/shared/Config";
import { type Privitak } from "../interfaces";

export class PrivitakService {
  private apiClient: AxiosInstance;
  constructor() {
    this.apiClient = axios.create({
      baseURL: `${config.apiURL}/privitak`,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async getPrivitci() {
    const response = await this.apiClient.get<Privitak[]>("");
    return response.data;
  }

  async getPrivitak(putanja: string) {
    const response = await this.apiClient.get(`/${putanja}`);
    return response.data;
  }

  async postPrivitak(dto: any) {
    const response = await this.apiClient.post("", dto, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }

  async deletePrivitak(putanja: string) {
    const response = await this.apiClient.delete(`/${putanja}`);
    return response.data;
  }
}
