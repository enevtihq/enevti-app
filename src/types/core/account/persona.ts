import { SocialProfileAsset } from './social';

export type PersonaService = {
  address: string;
  username: string;
};

export type Persona = {
  photo: string;
  base32: string;
  address: string;
  username: string;
};

export type PersonaAsset = Buffer;

export type PersonaAccountProps = {
  persona: {
    photo: string;
    username: string;
    social: SocialProfileAsset;
  };
};
