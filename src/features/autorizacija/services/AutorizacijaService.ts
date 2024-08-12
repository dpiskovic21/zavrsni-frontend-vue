import axios, { type AxiosInstance } from "axios";
import { config } from "@/shared/Config";
import type { PrijavaDTO } from "../interfaces";
import type { Korisnik } from "@/features/korisnik/interfaces";

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

  get prijavljeniKorisnik(): Korisnik | null {
    const korisnik = JSON.parse(localStorage.getItem("korisnik")!);

    if (!korisnik) {
      return null;
    }

    return korisnik;
  }

  async prijava(dto: PrijavaDTO) {
    const response = await this.apiClient.post("/prijava", dto);
    return response.data;
  }

  odjava() {
    localStorage.removeItem("korisnik");
  }
}
