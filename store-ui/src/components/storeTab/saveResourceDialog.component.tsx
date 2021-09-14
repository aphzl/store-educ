import { Form, Input, Modal } from "antd";
import { useForm } from "antd/lib/form/Form";
import { createRef, RefObject } from "react";
import { ApiBundle, Resource } from "../../api/api";
import uuid from 'react-uuid'

type SaveResourceDialogProps = {
    api: ApiBundle;
    selectedResource?: Resource;
    close: () => void;
    update: () => void;
};

export const SaveResourceDialog = (props: SaveResourceDialogProps) => {
    const { api, selectedResource, close, update } = props;

    const [form] = useForm();

    const nameInputRef = createRef<Input>();
    const inventaryIdInputRef = createRef<Input>();
    const amounInputRef = createRef<Input>();
    const commentInputRef = createRef<Input>();

    const getValue = (inputRef: RefObject<Input>): string | undefined => inputRef.current?.input.value;
    
    const checkInput = (input: Input | null): boolean => !!!input?.props.required || !!input.input.value
    const validate = () => [nameInputRef, inventaryIdInputRef, amounInputRef, commentInputRef]
            .every(i => checkInput(i.current));
    const okHandle = () => {
        if (!validate()) {
            [nameInputRef, inventaryIdInputRef, amounInputRef, commentInputRef]
                    .find(i => !checkInput(i.current))?.current?.focus();
            
            return;
        }
        
        const resource: Resource = {
            id: selectedResource?.id || uuid(),
            name: getValue(nameInputRef)!,
            inventoryId: getValue(inventaryIdInputRef),
            amount: parseInt(getValue(amounInputRef) || '0'),
            comment: getValue(commentInputRef)
        }

        api.resource
            .save(resource)
            .then(() => update());

        close();
    };

    return (
        <div>
            <Modal
                visible
                title='Добавление ресурса'
                cancelText='Отмена'
                onCancel={close}
                onOk={okHandle}
            >
                <Form form={form}>
                    <Form.Item
                        label='Наименование'
                        required
                        initialValue={selectedResource?.name}
                        name='name'

                    >
                        <Input
                            ref={nameInputRef}
                            type='text'
                            required
                        />
                    </Form.Item>
                    <Form.Item
                        label='Инвентарный номер'
                        name='inventory-id'
                        initialValue={selectedResource?.inventoryId}
                    >
                        <Input
                            ref={inventaryIdInputRef}
                            type='text'
                        />
                    </Form.Item>
                    <Form.Item
                        label='Количество'
                        name='amount'
                        initialValue={selectedResource?.amount}
                    >
                        <Input
                            ref={amounInputRef}
                            type='number'
                        />
                    </Form.Item>
                    <Form.Item
                        label='Коментарий'
                        name='comment'
                        initialValue={selectedResource?.comment}
                    >
                        <Input
                            ref={commentInputRef}
                            type='text'
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}