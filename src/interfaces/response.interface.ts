export type responseInterface =
  | errorResponseInterface
  | successResponseInterface;

interface errorResponseInterface {
  message: string;
}

interface successResponseInterface {
  payload: any;
}
