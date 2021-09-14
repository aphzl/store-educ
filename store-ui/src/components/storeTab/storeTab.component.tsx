import { Button, Input, Select, Table } from "antd";
import { Option } from "antd/lib/mentions";
import { createRef, RefObject, useState } from "react";
import { ApiBundle, Resource, ResourceInfo } from "../../api/api";
import { Tab } from "../tab.component";
import { sortBy } from 'lodash';
import { SaveResourceDialog } from "./saveResourceDialog.component";
import Search from "antd/lib/input/Search";
import Text from "antd/lib/typography/Text";
import { DeleteOutlined, EditOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import '../styles.css';

export type StoreTabProps = {
    api: ApiBundle;
    onAddToBasket: (resource: ResourceInfo) => void;
    setUpdateStoreTab: (func: () => void) => void;
};

type StoreTabHeaderProps = {
    api: ApiBundle;
    searchRef: RefObject<Input>;
    update: () => void;
    setLoadMethod: (func: (val?: string) => Promise<ResourceInfo[]>) => void;
};

type StoreTableProp = {
    data: ResourceInfo[];
    onDelete: (id: string) => void;
    onEdit: (resource: ResourceInfo) => void;
    onAddToBasket: (resource: ResourceInfo) => void;
};

export const StoreTab = (props: StoreTabProps) => {
    const { api, onAddToBasket, setUpdateStoreTab } = props;

    const [data, setData] = useState<ResourceInfo[]>([]);
    const [visibleEditResourceDialog, setVisibleEditResourceDialog] = useState<boolean>(false);
    const [slectedResource, setSelectedResource] = useState<ResourceInfo>();
    const [load, setLoad] = useState<(searchValue?: string) => Promise<ResourceInfo[]>> (() => () => api.resource.loadAll());

    const [searchRef, setSearchRef] = useState<RefObject<Input>>(createRef<Input>());

    const onDelete = async (id: string) =>
        api.resource.delete(id)
                .then(() => load(getSearchValue())
                    .then(lr => setData(lr)));
    const editHandle = (resource: ResourceInfo) => {
        setSelectedResource(resource);
        setVisibleEditResourceDialog(true);
    };
    const getSearchValue = () => searchRef?.current?.input.value;
    const update = () => load(getSearchValue()).then(r => setData(r));
    const setLoadMethod = m => {
        setLoad(() => m);
        setUpdateStoreTab(() => m(getSearchValue()).then(r => setData(r)));
    };

    return (
        <>
            <Tab
                header={
                    <StoreTabHeader
                        api={api}
                        update={update}
                        setLoadMethod={setLoadMethod}
                        searchRef={searchRef}
                    />
                }
                table={
                    <StoreTabTable
                        data={data}
                        onDelete={onDelete}
                        onEdit={editHandle}
                        onAddToBasket={onAddToBasket}
                    />
                }
            />
            {visibleEditResourceDialog &&
                <SaveResourceDialog
                    api={api}
                    close={() => setVisibleEditResourceDialog(false)}
                    update={update}
                    selectedResource={slectedResource}
                />
            }
        </>
    );
};

const StoreTabHeader = (props: StoreTabHeaderProps) => {
    const { api, searchRef, update, setLoadMethod } = props;
    const [addResourceDiaologVisible, setAddResourceDiaologVisible] = useState<boolean>(false);
    const loadMathods = {
        'all': (val?: string): Promise<ResourceInfo[]> => api.resource.loadAll(),
        'by-name': (val?: string): Promise<ResourceInfo[]> => api.resource.findByNameWith(val || ' ')
    };
    const addHandle = () => setAddResourceDiaologVisible(true);
    
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
                <Option value='by-name'>По имени</Option>
            </Select>
            <Search
                style={{ width: 200 }}
                type='text'
                ref={searchRef}
                onSearch={update}
            />
            <Button
                style={{ marginLeft: 50 }}
                type='primary'
                onClick={addHandle}
            >
                Добавить
            </Button>
            {addResourceDiaologVisible &&
                <SaveResourceDialog
                    api={api}
                    close={() => setAddResourceDiaologVisible(false)}
                    update={update}
                />}
        </div>
    );
};

const StoreTabTable = (props: StoreTableProp) => {
    const { data, onDelete, onEdit, onAddToBasket } = props;

    const addDisabled = (resource: ResourceInfo) => resource.available === 0;

    const columns =
    [
        {
            title: 'Инв. номер',
            dataIndex: 'inventoryId',
            key: 'inventoryId',
            width: 100
        },
        {
            title: 'Наименование',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Количество',
            dataIndex: 'amount',
            key: 'amount',
            width: 100
        },
        {
            title: 'Резерв',
            dataIndex: 'reserved',
            key: 'reserved',
            width: 100
        },
        {
            title: 'Доступно',
            dataIndex: 'available',
            key: 'available',
            width: 100
        },
        {
            title: 'Коментарий',
            dataIndex: 'comment',
            key: 'comment'
        },
        {
            title: '',
            dataIndex: 'buutons',
            key: 'buutons',
            width: 150,
            render: (_, item) => (
                <>
                    <Button
                        disabled={addDisabled(item)}
                        shape="circle"
                        icon={<ShoppingCartOutlined />} 
                        onClick={() => onAddToBasket(item)}
                    />
                    <Button
                        style={{ marginInline: 10}}
                        shape="circle"
                        icon={<EditOutlined />}
                        onClick={() => onEdit(item)}
                    />
                    <Button
                        shape="circle"
                        icon={<DeleteOutlined />}
                        onClick={() => onDelete(item.id)}
                    />
                </>
            )
        }
    ];

    return (
        <div>
            <Table
                columns={columns}
                dataSource={sortBy(data, r => r.name)}
                size="middle"
                rowKey={(item) => item.id}
            />
        </div>
    );
};