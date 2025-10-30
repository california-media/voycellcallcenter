import React, { useState } from "react";
import { Table } from "antd";
import { DatatableProps } from "../../data/interface"; // Ensure correct path
import { RiArrowLeftWideLine, RiArrowRightWideLine } from "react-icons/ri";

const Datatable: React.FC<DatatableProps> = ({ columns, dataSource }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
  const [paginationConfig, setPaginationConfig] = useState({
    current: 1,
    pageSize: 10,
    showQuickJumper: true,
    total: dataSource.length,
    showTotal: (total: number, range: [number, number]) => `Showing ${range[0]}–${range[1]} of ${total} results`,
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '30'],
    onChange: (page: number, pageSize: number) => {
      setPaginationConfig({
        ...paginationConfig,
        current: page,
        pageSize: pageSize,
      });
    },
    itemRender: (page:any, type:any, originalElement:any) => {
      if (type === 'prev') {
        return <RiArrowLeftWideLine />;
      }
      if (type === 'next') {
        return <RiArrowRightWideLine />;
      }
      return originalElement;
    },
  });

  const onSelectChange = (newSelectedRowKeys: any[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <>
      <Table
        className="table datanew dataTable no-footer"
        rowSelection={rowSelection}
        columns={columns}
        dataSource={dataSource}
        bordered
        scroll={{
          //  x: 'max-content', y: 300,
            scrollToFirstRowOnChange: true }}
        pagination={paginationConfig}
      />
    </>
  );
};

export default Datatable;
