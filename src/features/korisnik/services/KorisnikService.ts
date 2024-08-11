import axios, { type AxiosInstance } from "axios";
import { config } from "@/shared/Config";
import type { Korisnik } from "../interfaces";

export class KorisnikService {
  private apiClient: AxiosInstance;
  constructor() {
    this.apiClient = axios.create({
      baseURL: `${config.apiURL}/korisnik`,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async getKorisnici() {
    const response = await this.apiClient.get<Korisnik[]>("/");
    return response.data;
  }
}
