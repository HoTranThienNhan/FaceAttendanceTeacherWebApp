import { Table } from 'antd';
import React, { useRef } from 'react';
import LoadingComponent from './LoadingComponent';

const TableComponent = (props) => {
    const {
        selectionType = '',
        data = [],
        columns = [],
        isLoading = false,
        ref = null
    } = props;

    const tableRef = useRef(null);

    return (
        <LoadingComponent isLoading={isLoading}>
            <Table
                columns={columns}
                dataSource={data}
                ref={ref}
                {...props}
            />
        </LoadingComponent>
    )
};

export default TableComponent;
