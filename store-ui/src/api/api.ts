export type Resource = {
    id: string;
    inventoryId?: string;
    name: string;
    amount: number;
    comment?: string;
};

export type ResourceInfo = Resource & {
    reserved: number;
    available: number;
};

export type Request = {
    id: string;
    userRequestId: string;
    resourceId: string;
    amount: number;
};

export enum RequestStatus {
    OPEN = 'OPEN',
    READY = 'READY',
    DONE = 'DONE',
    ABORT = 'ABORT'
};

export const statusMap = {
    [RequestStatus.OPEN]: 'Открыта',
    [RequestStatus.READY]: 'Готова к выдаче',
    [RequestStatus.DONE]: 'Обработана',
    [RequestStatus.ABORT]: 'Отменена',
};

export type UserRequest = {
    id: string;
    declarer: string;
    status: RequestStatus;
    createdAt?: number;
    updatedAt?: number;
    requests: Request[];
};

export class ApiBundle {
    public resource: ResourceApi = new ResourceApi(this.url);
    public userRequest: UserRequestApi = new UserRequestApi(this.url);

    constructor(private url: string) {}
};

export class ResourceApi {
    private urn = '/api/resource';

    public loadAll = (): Promise<ResourceInfo[]> => 
        fetch(`${this.url}${this.urn}`)
                .then((response) => {
                    if (response.status >= 200 && response.status < 300) {
                        return response.json();
                    } else {
                        throw response;
                    }
                });

    public findById = (id: string): Promise<Resource> =>
        fetch(`${this.url}${this.urn}/${id}`)
                .then((response) => {
                    if (response.status >= 200 && response.status < 300) {
                        return response.json();
                    } else {
                        throw response;
                    }
                });

    public findByNameWith = (text: string): Promise<ResourceInfo[]> =>
        fetch(`${this.url}${this.urn}/${text}/text`)
                .then((response) => {
                    if (response.status >= 200 && response.status < 300) {
                        return response.json();
                    } else {
                        throw response;
                    }
                });

    public save = (resource: Resource): Promise<Resource> => {
        const fetchOptions: RequestInit = { method: "POST", body: JSON.stringify(resource), headers: {"Content-Type": "application/json"} };

        return fetch(`${this.url}${this.urn}`, fetchOptions)
                .then((response) => {
                    if (response.status >= 200 && response.status < 300) {
                        return response.json();
                    } else {
                        throw response;
                    }
                });
    };

    public delete = (id: string) => {
        const fetchOptions: RequestInit = { method: "DELETE", headers: {"Content-Type": "application/json"} };

        return fetch(`${this.url}${this.urn}/${id}`, fetchOptions)
                .then((response) => {
                    if (response.status >= 200 && response.status < 300) {
                        return response;
                    } else {
                        throw response;
                    }
                });
    };

    constructor(private url: string) {};
};

export class UserRequestApi {
    private urn = '/api/user-request';
    public loadAll = () =>
        fetch(`${this.url}${this.urn}`)
                .then((response) => {
                    if (response.status >= 200 && response.status < 300) {
                        return response.json();
                    } else {
                        throw response;
                    }
                });

    public findByDeclarer = (declarer: string) =>
        fetch(`${this.url}${this.urn}/${declarer}/declarer`)
            .then((response) => {
                    if (response.status >= 200 && response.status < 300) {
                        return response.json();
                    } else {
                        throw response;
                    }
                });

    public save = (request: UserRequest): Promise<boolean> => {
        const fetchOptions: RequestInit = { method: "POST", body: JSON.stringify(request), headers: {"Content-Type": "application/json"} };

        return fetch(`${this.url}${this.urn}`, fetchOptions)
                .then((response) => {
                    if (response.status >= 200 && response.status < 300) {
                        return response.json();
                    } else {
                        throw response;
                    }
                });
    };

    constructor(private url: string) {};
};
