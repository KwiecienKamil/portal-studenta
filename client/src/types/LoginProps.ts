export interface OnTokenProps {
  onToken: (token: string) => void;
}

export interface LoginProps extends OnTokenProps {}

export interface GoogleLoginBtnProps extends OnTokenProps {}
