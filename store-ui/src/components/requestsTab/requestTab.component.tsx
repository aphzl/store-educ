import { Button, Input, Table, Select } from "antd";
import { Tab } from "../tab.component";
import { sortBy } from 'lodash';
import { ApiBundle, UserRequest } from "../../api/api";
import { Option } from "antd/lib/mentions";
import { createRef, RefObject, useState } from "react";

type RequestsTabHeaderProps = {
    api: ApiBundle;
    searchRef: RefObject<Input>;    
    update: () => void;
    setLoadMethod: (func: (val?: string) => Promise<UserRequest[]>) => void;
}

type RequestsTabProps = {
    api: ApiBundle;
}

type RequestsTabTableProps = {
    data: UserRequest[];
}

export const RequestsTab = (props: RequestsTabProps) => {
    const { api } = props;

    const [data, setData] = useState<UserRequest[]>([]);
    const [searchRef, setSearchRef] = useState<RefObject<Input>>(createRef<Input>());
    const [load, setLoad] = useState<(searchValue?: string) => Promise<UserRequest[]>> (() => () => api.userRequest.loadAll());
    const getSearchValue = () => searchRef?.current?.input.value;
    const update = () => load(getSearchValue()).then(r => setData(r));

    return (
        <Tab
            header={
                <RequestsTabHeader
                    api={api}
                    searchRef={searchRef}                    
                    update={update}
                    setLoadMethod={m => setLoad(() => m)}
                />
            }
            table={
                <RequestsTabTable
                    data={data}
                    // api={api}
                />}
        />
    );
}

const RequestsTabHeader = (props: RequestsTabHeaderProps) => {
    const { api, searchRef, update, setLoadMethod } = props;
    const loadMathods = {
        'all': (val?: string): Promise<UserRequest[]> => api.userRequest.loadAll(),
        'by-declarer': (val?: string): Promise<UserRequest[]> => api.userRequest.findByDeclarer(val || ' ')
    };

    return (
        <div>
            <Select
                defaultValue='all'
                onChange={(v, o) => setLoadMethod(loadMathods[v])}
            >
                <Option value='all'>Все</Option>
                <Option value='by-declarer'>По заявителю</Option>
            </Select>
            <Input type='text' ref={searchRef} />
            <Button onClick={update} >Найти</Button>
        </div>
    );
}

const RequestsTabTable = (props: RequestsTabTableProps) => {
    const { data } = props;

    const columns =
    [
        {
            title: 'Заявитель',
            dataIndex: 'declarer',
            key: 'declarer'
        },
        {
            title: 'Дата создания',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 200
        },
        {
            title: 'Дата изменения',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            width: 200
        },
        {
            title: 'Статус',
            dataIndex: 'status',
            key: 'status',
            width: 200
        },
        {
            title: 'Коментарий',
            dataIndex: 'comment',
            key: 'comment'
        }
    ]

    return (
        <div>
            <Table
                columns={columns}
                dataSource={data}
                size="middle"
                rowKey={(item) => item.id}
            />
        </div>
    );
}