import { Button, Table, Form, Input } from "antd";
import { Tab } from "../tab.component";
import { sortBy } from 'lodash';
import { ApiBundle, RequestStatus, ResourceInfo, UserRequest, Request } from "../../api/api";
import { createRef, RefObject } from "react";
import uuid from 'react-uuid'
import Text from "antd/lib/typography/Text";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import '../styles.css';

export type BasketState = {
    [byResourceId: string]: BasketTableRow;
};

export type BasketTabProps = {
    basketState: BasketState;
    api: ApiBundle;
    onBasketEdit: (resource: ResourceInfo) => void;
    onDelete: (resourceId: string) => void;
    clearBasketState: () => void;
    updateAll: () => void;
};

type BasketTabTableProps = {
    data: BasketTableRow[];
    onEdit: (row: BasketTableRow) => void;
    onDelete: (resourceId: string) => void;
};

export type BasketTableRow = {
    resourceId: string;
    inventoryId: string;
    name: string;
    amount: number;
    resource: ResourceInfo;
};

type BasketTabHeaderProps = {
    declarerInputRef: RefObject<Input>;
    createRequest: () => void;
};

export const BasketTab = (props: BasketTabProps) => {
    const { basketState, api, onBasketEdit, onDelete, clearBasketState, updateAll } = props;

    const declarerInputRef = createRef<Input>();

    const onEdit = (row: BasketTableRow) => onBasketEdit(row.resource);
    const deleteHandle = (resourceId: string) => onDelete(resourceId);
    const createRequest = () => {
        if (!declarerInputRef.current?.input.value) {
            declarerInputRef.current?.focus();

            return;
        }

        const id = uuid();
        const requests: Request[] = Object.values(basketState)
                .map(
                    v => ({
                        id: uuid(),
                        userRequestId: id,
                        resourceId: v.resourceId,
                        amount: v.amount 
                    }));
        const userRequest: UserRequest = {
            id,
            declarer: declarerInputRef.current?.input.value,
            status: RequestStatus.OPEN,
            requests
        }

        api.userRequest.save(userRequest).then(() => updateAll());
        clearBasketState();
    };

    return (
        <Tab
            header={
                <BasketTabHeader
                    declarerInputRef={declarerInputRef}
                    createRequest={createRequest}
                />
            }
            table={
                <BasketTabTable
                    data={Object.values(basketState)}
                    onDelete={deleteHandle}
                    onEdit={onEdit}
                />
            }
        />
    );
};

const BasketTabHeader = (props: BasketTabHeaderProps) => {
    const { declarerInputRef, createRequest } = props;

    return (
        <>
            <div className='headerContainer' >
                <Text style={{ marginRight: 20 }}>
                    Имя заявителя:
                </Text>
                <Input
                    style={{ width: 200 }}
                    type='text'
                    ref={declarerInputRef}
                />
                <Button
                    type='primary'
                    onClick={createRequest}
                >
                    Создать
                </Button>
            </div>
        </>
    );
}

export const BasketTabTable = (props: BasketTabTableProps) => {
    const { data, onEdit, onDelete } = props;

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
            title: '',
            dataIndex: 'buutons',
            key: 'buutons',
            width: 100,
            render: (_, item) => (
                <>
                    <Button
                        shape="circle"
                        icon={<EditOutlined />}
                        onClick={() => onEdit(item)}
                    />
                    <Button
                        style={{ marginInline: 10}}
                        shape="circle"
                        icon={<DeleteOutlined />}
                        onClick={() => onDelete(item.resourceId)}
                    />
                </>
            )
        }
    ]

    return (
        <div>
            <Table
                columns={columns}
                dataSource={sortBy(data, r => r.name)}
                size="middle"
                rowKey={(item) => item.resourceId}
            />
        </div>
    );
}
