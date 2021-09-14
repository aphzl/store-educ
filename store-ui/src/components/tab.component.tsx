type TabProps = {
    header: React.ReactNode;
    table: React.ReactNode;
}

export const Tab = (props: TabProps) => {
    const { header, table } = props;

    return (
        <div>
            {header}
            <br/>
            {table}
        </div>
    );
}