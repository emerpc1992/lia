export interface Colors {
  primary: string;
  secondary: string;
  loginButton: string;
}

export interface Images {
  loginLogo: string;
  favicon: string;
  loginBackground: string;
}

export interface Branding {
  name: string;
  slogan: string;
  browserTitle: string;
}

export interface AppearanceState {
  colors: Colors;
  images: Images;
  branding: Branding;
}