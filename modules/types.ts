// The Todo object
export interface Todo {
  id: number;
  userId?: number;
  title: string;
  completed: boolean;
}

// The User object
export interface User {
  id: number;
  name: string;
  username: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

export class JsonResponse extends Response {
  constructor(body: any, init?: ResponseInit) {
    super(JSON.stringify(body), {
      headers: {
        "Content-Type": "application/json",
        ...init?.headers,
      },
      ...init,
    });
  }
}

export class ErrorResponse extends JsonResponse {
  constructor(message: string, status = 400) {
    super({ error: message }, { status });
  }
}
