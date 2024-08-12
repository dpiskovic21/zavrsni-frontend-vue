export interface Statistika {
  korisniciSaBrojemZadataka: {
    [idKorisnika: string]: {
      naziv: string;
      brojZadataka: number;
    };
  };
  zakasnjeliRokovi: {
    [idKorisnika: string]: {
      naziv: string;
      brojZadataka: number;
    };
  };
}
