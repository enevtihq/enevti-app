export type DeliverSecretProps = {
  id: string;
  cipher: string;
  signature: {
    cipher: string;
    plain: string;
  };
};

export type DeliverSecretUI = DeliverSecretProps;
