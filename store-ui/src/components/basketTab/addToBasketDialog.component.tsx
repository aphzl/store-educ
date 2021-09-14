import { Modal, Form, Input, InputNumber } from "antd";
import { createRef } from "react";
import { Resource, ResourceInfo } from "../../api/api";

type AddToBasketDialogProps = {
    resource: ResourceInfo;
    close: () => void;
    onOk: (resource: ResourceInfo, amount: number) => void;
};

export const AddToBasketDialog = (props: AddToBasketDialogProps) => {
    const { resource, close, onOk } = props;

    const inputRef = createRef<HTMLInputElement>()
    const okHandle = () => {
        const val = parseInt(inputRef.current?.value || '0');
        if (val > resource.available) {
            return;
        }

        onOk(resource, val);
    };

    return (
        <>
            <Modal
                title='Добавление заявки в корзину'
                visible
                onOk={okHandle}
                onCancel={close}
            >
                <Form>
                    <Form.Item label='Доступно'>
                        {resource.available}
                    </Form.Item>
                    <Form.Item
                        label='Количество'
                    >
                        <InputNumber
                            min={0}
                            defaultValue={0}
                            type='number'
                            ref={inputRef}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};