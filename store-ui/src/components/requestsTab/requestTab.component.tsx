import { Button, Input, Table, Select } from "antd";
import { Tab } from "../tab.component";
import { sortBy } from 'lodash';
import { ApiBundle, RequestStatus, Resource, statusMap, UserRequest } from "../../api/api";
import { Option } from "antd/lib/mentions";
import { createRef, RefObject, useState } from "react";
import Text from "antd/lib/typography/Text";
import Search from "antd/lib/input/Search";
import '../styles.css';
import { EditOutlined } from "@ant-design/icons";
import { EditRequestDialog } from "./editRequestDialog.component";

type RequestsTabHeaderProps = {
    api: ApiBundle;
    searchRef: RefObject<Input>;    
    update: () => void;
    setLoadMethod: (func: (val?: string) => Promise<UserRequest[]>) => void;
};

type RequestsTabProps = {
    api: ApiBundle;
};

type RequestsTabTableProps = {
    data: UserRequest[];
    save: (request: UserRequest) => Promise<boolean>;
    update: () => void;
    getResource: (id: string) => Promise<Resource>;
};

export const RequestsTab = (props: RequestsTabProps) => {
    const { api } = props;

    const [data, setData] = useState<UserRequest[]>([]);
    const [searchRef, setSearchRef] = useState<RefObject<Input>>(createRef<Input>());
    const [load, setLoad] = useState<(searchValue?: string) => Promise<UserRequest[]>> (() => () => api.userRequest.loadAll());
    const getSearchValue = () => searchRef?.current?.input.value;
    const update = () => load(getSearchValue()).then(r => setData(r));
    const save = (request: UserRequest) => api.userRequest.save(request);
    const getResource = (id: string) => api.resource.findById(id);

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
                    save={save}
                    update={update}
                    getResource={getResource}
                />
            }
        />
    );
};

const RequestsTabHeader = (props: RequestsTabHeaderProps) => {
    const { api, searchRef, update, setLoadMethod } = props;
    const loadMathods = {
        'all': (val?: string): Promise<UserRequest[]> => api.userRequest.loadAll(),
        'by-declarer': (val?: string): Promise<UserRequest[]> => api.userRequest.findByDeclarer(val || ' ')
    };

    return (
        <div className='headerContainer' >
            <Text style={{ marginRight: 20 }}>
                Искать:
            </Text>
            <Select
                className='headerSelect'
                defaultValue='all'
                onChange={(v, o) => setLoadMethod(loadMathods[v])}
            >
                <Option value='all'>Все</Option>
                <Option value='by-declarer'>По заявителю</Option>
            </Select>
            <Search
                style={{ width: 200 }}
                type='text'
                ref={searchRef}
                onSearch={update}
            />
        </div>
    );
};

const RequestsTabTable = (props: RequestsTabTableProps) => {
    const { data, save, update, getResource } = props;

    const [visibleEditRequestDialog, setVisibleEditRequestDialog] = useState<boolean>(false);
    const [selectedRequest, setSelectedRequest] = useState<UserRequest>({} as UserRequest);
    // const [resources, setResources] = useState<Resource[]>([])
    
    const closeEditDialog = () => setVisibleEditRequestDialog(false);
    const onEdit = (userRequest: UserRequest) => {
        // userRequest.requests
        //     .forEach(r => getResource(r.resourceId)
        //         .then(resource => setResources([...resources, resource])));
        setSelectedRequest(userRequest);
        setVisibleEditRequestDialog(true);
    };
    const onOkEdit = (request: UserRequest) => {
        save(request)
            .then(r => update());
        closeEditDialog();
    };

    const columns =
    [
        {
            title: 'Заявитель',
            dataIndex: 'declarer',
            key: 'declarer',
        },
        {
            title: 'Дата создания',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 200,
            render: (val, item) => (<>{new Date(val).toLocaleString()}</>)
        },
        {
            title: 'Дата изменения',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            width: 200,
            render: (val, item) => (<>{new Date(val).toLocaleString()}</>)
        },
        {
            title: 'Статус',
            dataIndex: 'status',
            key: 'status',
            width: 200,
            render: (val: RequestStatus, item) => (<>{statusMap[val]}</>)
        },
        {
            title: '',
            dataIndex: 'buutons',
            key: 'buutons',
            render: (_, item) => (
                <>
                    <Button
                        style={{ marginInline: 10}}
                        shape="circle"
                        icon={<EditOutlined />}
                        onClick={() => onEdit(item)}
                    />
                </>
            )
        }
    ];

    return (
        <div>
            <Table
                columns={columns}
                dataSource={sortBy(data, i => i.createdAt).reverse()}
                size="middle"
                rowKey={(item) => item.id}
            />
            {visibleEditRequestDialog && 
                <EditRequestDialog
                    selectedRequest={selectedRequest}
                    // resources={resources}
                    close={closeEditDialog}
                    onOk={onOkEdit}
                    getResource={getResource}
                />
            }
        </div>
    );
};