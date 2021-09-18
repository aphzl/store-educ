import { Menu } from "antd";
import { useState } from 'react';
import { SelectInfo } from 'rc-menu/lib/interface';
import { ApiBundle, Resource, ResourceInfo } from "../api/api";
import { RequestsTab } from "./requestsTab/requestTab.component";
import { StoreTab } from "./storeTab/storeTab.component";
import { BasketState, BasketTab, BasketTableRow } from "./basketTab/basketTab.component";
import "antd/dist/antd.css";
import { AddToBasketDialog } from "./basketTab/addToBasketDialog.component";

const STORE_TAB_KEY = 'store-tab';
const REQUEST_TAB_KEY = 'requests-tab';
const BASKET_TAB_KEY = 'basket-tab';



export const Pane = () => {
    const originUrl = window.location.origin;
    // 3000 and 3001 use for deev
    const serverUrl = (originUrl.endsWith('3000') || originUrl.endsWith('3001')) ? 'http://localhost:8080' : originUrl;
    const api = new ApiBundle(serverUrl);

    const [selectedTabKey, setSelectedTabKey] = useState<string>(STORE_TAB_KEY);
    const [basketState, setBasketState] = useState<BasketState>({});
    const [visibleAddToBasketDialog, setVisibleAddToBasketDialog] = useState<boolean>(false);
    const [addingResource, setAddingResource] = useState<ResourceInfo>();
    const [updateStoreTab, setUpdateStoreTab] = useState<() => void> (() => () => {});

    const closeBasketDialog = () => setVisibleAddToBasketDialog(false);
    const onSelect = (param: SelectInfo) => setSelectedTabKey(param.key);
    const addToBaskeHandle = (resource: ResourceInfo) => {
        setVisibleAddToBasketDialog(true);
        setAddingResource(resource);
    };
    const onOkAddToBasket = (resource: ResourceInfo, amount: number) => {
        setBasketState({
            ...basketState,
            [resource.id]: {
                resourceId: resource.id,
                name: resource.name,
                inventoryId: resource.inventoryId,
                amount,
                resource
            } as BasketTableRow
        });
        closeBasketDialog();
    };
    const deleteFromBasket = (resourceId: string) => {
        const stateNew = { ...basketState };
        console.log(stateNew)
        delete stateNew[resourceId];
        console.log(stateNew)
        setBasketState({...stateNew});
    }

    return (
        <div className='pane' >
            <div style={{ float: 'left', width: '200px' }}>
                <Menu
                    style={{ width: '100%' }}
                    selectedKeys={[selectedTabKey]}
                    onSelect={onSelect}
                >
                    <Menu.Item key={STORE_TAB_KEY}>Склад</Menu.Item>
                    <Menu.Item key={REQUEST_TAB_KEY}>Заявки</Menu.Item>
                    <Menu.Item key={BASKET_TAB_KEY}>Корзина</Menu.Item>
                </Menu>
            </div>
            <div style={{ float: 'left',  width: 'calc(100% - 200px)' }}>
                <TabsPane
                    selectedTabKey={selectedTabKey}
                    api={api}
                    basketState={basketState}
                    onAddToBasket={addToBaskeHandle}
                    setBasketState={setBasketState}
                    deleteFromBasket={deleteFromBasket}
                    clearBasketState={() => setBasketState({})}
                    updateStoreTab={updateStoreTab}
                    setUpdateStoreTab={m => setUpdateStoreTab(() => m)}
                />
                {visibleAddToBasketDialog &&
                    <AddToBasketDialog
                        resource={addingResource!}
                        close={closeBasketDialog}
                        onOk={onOkAddToBasket}
                    />
                }
            </div>
            <br/>
        </div>
    );
};

type TabsPaneProps = {
    selectedTabKey: string;
    api: ApiBundle;
    basketState: BasketState;
    setBasketState: (state: BasketState) => void;
    onAddToBasket: (resource: ResourceInfo) => void;
    deleteFromBasket: (resourceId: string) => void;
    clearBasketState: () => void;
    updateStoreTab: () => void;
    setUpdateStoreTab: (func: () => void) => void;
};

const TabsPane = (props: TabsPaneProps) => {
    const {
        selectedTabKey,
        api,
        basketState,
        onAddToBasket,
        deleteFromBasket,
        clearBasketState,
        updateStoreTab,
        setUpdateStoreTab
    } = props;

    const show = (key: string) => selectedTabKey === key ? 'block' : 'none';
    const updateAll = () => {
        console.log('dffd')
        updateStoreTab();
    };

    return (
        <>
            <div style={{ display: show(STORE_TAB_KEY) }}>
                <StoreTab
                    api={api}
                    onAddToBasket={onAddToBasket}
                    setUpdateStoreTab={setUpdateStoreTab}
                />
            </div>
            <div style={{ display: show(REQUEST_TAB_KEY) }}>
                <RequestsTab api={api} />
            </div>
            <div style={{ display: show(BASKET_TAB_KEY) }}>
                <BasketTab
                    basketState={basketState}
                    api={api}
                    onBasketEdit={onAddToBasket}
                    onDelete={deleteFromBasket}
                    clearBasketState={clearBasketState}
                    updateAll={updateAll}
                />
            </div>
        </>
    );
};