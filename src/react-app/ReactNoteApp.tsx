import { Space, Button, Table, TableProps, Modal, message } from "antd";
import { useState } from "react";
import { Note } from "./types";
import ReactNoteModal from "./ReactNoteModal";
import NotesAPI from "../api";
import "./ReactNote.css";
import moment from "moment";
import { exportXML } from "./utils";

interface Modal {
    type: "add" | "edit" | "check";
    isOpen: boolean;
    curRow?: Note;
}

function ReactNoteAPP() {
    // 表格表头
    const tableColumns: TableProps["columns"] = [
        {
            title: "标题",
            dataIndex: "title",
            ellipsis: true,
        },
        {
            title: "内容",
            dataIndex: "body",
            ellipsis: true,
        },
        {
            title: "日期",
            dataIndex: "updated",
            ellipsis: true,
            render: (value) => moment(value).format("YYYY-MM-DD HH:mm:ss"),
        },
        {
            title: "操作",
            align: "center",
            render: (_, record) => (
                <Space size="middle">
                    <a onClick={() => openModal("check", record)}> 查看 </a>
                    <a onClick={() => openModal("edit", record)}> 编辑 </a>
                    <a onClick={() => deleteNote(record.id)}> 删除 </a>
                </Space>
            ),
        },
    ];

    const [tableData, setTableData] = useState<Note[]>(NotesAPI.getAllNotes());

    // 新增、编辑、查看笔记
    const [modal, setModal] = useState<Modal>();
    const openModal = (type: "add" | "edit" | "check", curRow?: Note) => {
        setModal({
            type: type,
            isOpen: true,
            curRow: curRow,
        });
    };

    // 删除笔记
    const { confirm } = Modal;
    const deleteNote = (id: number) => {
        confirm({
            title: "确定要删除该笔记?",
            content: "删除后将无法恢复",
            okText: "确定",
            okType: "danger",
            cancelText: "取消",
            onOk() {
                NotesAPI.deleteNote(id);
                message.success("删除成功");
                setTableData(NotesAPI.getAllNotes());
            },
        });
    };

    // 导出笔记
    const exportNote = () => {
        if (tableData.length <= 0) {
            message.warning("请先添加笔记");
            return;
        }

        const xmlUrl = exportXML(tableData);
        const link = document.createElement("a");
        link.href = xmlUrl;
        link.setAttribute("download", "data.xml");
        document.body.appendChild(link);
        link.click();
    };

    return (
        <div>
            <h1 className="app-title">React TypeScript Note</h1>
            <div className="app-page">
                <Space className="app-button">
                    <Button type="primary" onClick={() => openModal("add")}>
                        添加
                    </Button>
                    <Button onClick={exportNote}> 导出 </Button>
                </Space>

                <Table
                    rowKey={(record) => record.id}
                    pagination={false}
                    columns={tableColumns}
                    dataSource={tableData}
                />
            </div>

            {/* 对话框 */}
            {modal?.isOpen && (
                <ReactNoteModal
                    type={modal.type}
                    curRow={modal.curRow}
                    closeModal={() => {
                        setModal({
                            ...modal,
                            isOpen: false,
                        });
                    }}
                    refreshTable={() => setTableData(NotesAPI.getAllNotes())}
                />
            )}
        </div>
    );
}

export default ReactNoteAPP;
