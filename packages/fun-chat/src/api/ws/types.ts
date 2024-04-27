export type TUser = {
  id?: string;
  login: string;
  password: string;
  isLogined?: boolean;
  server?: string;
};

export type TMessage = {
  id: string;
  from: string;
  to: string;
  text: string;
  datetime: number;
  status: {
    isDelivered: boolean;
    isReaded: boolean;
    isEdited: boolean;
    isDeleted: boolean;
  };
};

export type TResponseType =
  | 'USER_LOGIN'
  | 'USER_LOGOUT'
  | 'USER_EXTERNAL_LOGIN'
  | 'USER_EXTERNAL_LOGOUT'
  | 'USER_ACTIVE'
  | 'USER_INACTIVE'
  | 'MSG_SEND'
  | 'MSG_DELIVER'
  | 'MSG_READ'
  | 'MSG_FROM_USER'
  | 'MSG_DELETE'
  | 'MSG_EDIT'
  | 'ERROR'
  | 'ERROR_500';

export type TRequest = {
  id: string;
  type: TResponseType;
  payload: {
    user: TUser;
  } | null;
};

export type TResponse = {
  id?: string;
  type: TResponseType;
  payload: {
    user?: TUser;
    error?: string;
  };
};

export type TResponseUsers = {
  id: string;
  type: 'USER_ACTIVE' | 'USER_INACTIVE';
  payload: {
    users: TUser[];
  };
};

export type TResponseMessage = {
  id: string;
  type: 'MSG_SEND' | 'ERROR';
  payload: {
    message?: TMessage;
    error?: string;
  };
};

export type TResponseMessages = {
  id: string;
  type: 'MSG_FROM_USER' | 'ERROR';
  payload: {
    messages?: TMessage[];
    error?: string;
  };
};

export type TSendRequest = {
  id: string;
  type: 'MSG_SEND';
  payload: {
    message: {
      to: string;
      text: string;
    };
  };
};

export type TSendResponse = {
  type: 'MSG_SEND' | 'ERROR';
  payload: {
    message?: TMessage;
    error?: string;
  };
};

export type TEditRequest = {
  id: string;
  type: 'MSG_READ' | 'MSG_DELETE' | 'MSG_EDIT';
  payload: {
    message: {
      id: string;
      text?: string;
    };
  };
};
