import { Modal, Select, Table } from "antd";
import { Option } from "antd/lib/mentions";
import Text from "antd/lib/typography/Text";
import { useEffect, useState } from "react";
import { RequestStatus, statusMap, UserRequest, Request, Resource } from "../../api/api";

type TableData = Request & {
    inventoryId: string;
    name: string;
}

type EditRequestDialogProps = {
    selectedRequest: UserRequest;
    close: () => void;
    onOk: (request: UserRequest) => void;
    getResource: (id: string) => Promise<Resource>;
};

export const EditRequestDialog = (props: EditRequestDialogProps) => {
    const { selectedRequest, close, onOk, getResource } = props;

    const [status, setStatus] = useState<RequestStatus>(selectedRequest.status);
    const [resources, setResources] = useState<Resource[]>([{} as Resource]);

    useEffect(() => {
        selectedRequest.requests
            .forEach(r => getResource(r.resourceId)
                .then(resource => setResources(r => [...r, resource])));
    }, []);

    const handleOk = () => {
        const requestToSave: UserRequest = {
            ...selectedRequest,
            status,
            requests: []
        };

        onOk(requestToSave);
    };

    const columns = [
        {
            title: 'Инв. номер',
            dataIndex: 'inventoryId',
            key: 'inventoryId',
            width: 110
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
            width: 105
        }
    ];

    const data: TableData[] = selectedRequest.requests
        ?.map(r => {
            const resource = resources.find(resource => resource.id == r.resourceId);
            return {
                ...r,
                inventoryId: resource?.inventoryId || '',
                name: resource?.name || ''
            } as TableData;
        }) || [];

    return (
        <>
            <Modal
                visible
                title='Заявка'
                onCancel={close}
                onOk={handleOk}
                okText='Сохранить'
                cancelText='Отмена'
            >
                <div style={{ marginBottom: 20 }}>
                    <Text style={{ marginRight: 20 }}>
                    Статус:
                </Text>
                <Select
                    style={{ width: 160 }}
                    defaultValue={selectedRequest.status}
                    onChange={v => setStatus(v)}
                >
                    <Option value={RequestStatus.OPEN} >
                        {statusMap[RequestStatus.OPEN]}
                    </Option>
                    <Option value={RequestStatus.READY} >
                        {statusMap[RequestStatus.READY]}
                    </Option>
                    <Option value={RequestStatus.DONE} >
                        {statusMap[RequestStatus.DONE]}
                    </Option>
                    <Option value={RequestStatus.ABORT} >
                        {statusMap[RequestStatus.ABORT]}
                    </Option>
                </Select>
                </div>
                <div style={{ marginBottom: 20 }} >
                    Заявитель: {selectedRequest.declarer}
                </div>
                <div style={{ marginBottom: 20 }} >
                    Состав:
                </div>
                <Table
                    columns={columns}
                    dataSource={data}
                    size="middle"
                    rowKey={(item) => item.id}
                />
            </Modal>
        </>
    );
};