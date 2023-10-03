export type ConsumerTransactionType = {
  id: number;
  name: string;
  accountNumber: number; // string
  applicationNumber: number;
  subTransactionType: { id: number; subTransactionType: number; name: string };
  transactionType: { id: number; name: string };
  consumerPriority: { id: number; name: string };
  counterPersonnel: {
    id: number;
    username: string;
    password: string;
    tag: string;
  };
  date: string;
  timeGeneratedQueue: string;
  timeStartTransaction: string;
  timeEndTransaction: string;
  transactionStatus: { id: number; name: string };
  transactionNote: string;
  paymentInfo: string;
  transferredFrom: number;
  rng: string;
};

export type ConsumerPriorityType = {
  id: number;
  name: string;
};

export type CounterPersonnelType = {
  total: number;
  transactionType: {
    id: number | null;
    name: string;
  } | null;
  id: number | null;
  firstname: string;
  lastname: string;
  password: string;
  username: string;
  tag: string;
};

export type SubTransactionType = {
  id: number;
  name: string;
  transactionType?: number;
};

export type TransactionStatusType = {
  transactionStatus: number;
  name: string;
};

export type TransactionType = {
  id: number;
  name: string;
};

export type TransferredFrom = {
  id: number;
  transactionNote: string;
  transactionFrom: string;
  consumerTransaction: {
    id: number;
    name: string;
    accountNumber: number; // string
    applicationNumber: number;
    subTransactionType: {
      id: number;
      subTransactionType: number;
      name: string;
    };
    transactionType: { id: number; name: string };
    consumerPriorityId: number;
    counterPersonnel: {
      id: number;
      username: string;
      password: string;
      tag: string;
    };
    date: string;
    timeGeneratedQueue: string;
    timeStartTransaction: string;
    timeEndTransaction: string;
    transactionStatus: { id: number; name: string };
    transactionNote: string;
    paymentInfo: string;
    transferredFrom: number;
  };
  transactionType: {
    id: number;
    name: string;
  };
};

export type TransferredTo = {
  id: number;
  transactionNote: string;
  consumerTransaction: {
    id: number;
    name: string;
    accountNumber: number; // string
    applicationNumber: number;
    subTransactionType: {
      id: number;
      subTransactionType: number;
      name: string;
    };
    transactionType: { id: number; name: string };
    consumerPriorityId: number;
    counterPersonnel: {
      id: number;
      username: string;
      password: string;
      tag: string;
    };
    date: string;
    timeGeneratedQueue: string;
    timeStartTransaction: string;
    timeEndTransaction: string;
    transactionStatus: { id: number; name: string };
    transactionNote: string;
    paymentInfo: string;
    transferredFrom: number;
  };
};
