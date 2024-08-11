export interface CreateZadatakDTO {
  naziv: string;
  opis: string;
  projektId: number;
  izvrsiteljId: number;
  izvjestiteljId: number;
  prioritet: string;
  rok: Date;
}
