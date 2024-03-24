import { Button, Modal, Form, FormInstance, Input, message } from "antd";
import { useRef, useState } from "react";
import { Note } from "./types";
import NotesAPI from "../api";
import "./ReactNote.css";

interface PropsData {
    type: "add" | "edit" | "check";
    closeModal: () => void;
    refreshTable: () => void;
    curRow?: Note;
}

function ReactNoteModal(props: PropsData) {
    const [modalVisiable, setModalVisiable] = useState(true);

    const baseFormRef = useRef<FormInstance>(null);
    const { TextArea } = Input;

    // 保存笔记
    const save = () => {
        if (props.type === "edit") {
            const { confirm } = Modal;
            confirm({
                title: "确定要保存该笔记?",
                okText: "确定",
                cancelText: "取消",
                onOk() {
                    // 更新笔记
                    NotesAPI.saveNote({
                        ...props.curRow,
                        ...baseFormRef.current?.getFieldsValue(),
                    });
                    setModalVisiable(false);
                    message.success("保存成功");
                    props.refreshTable();
                },
            });
        } else {
            // 新增笔记
            NotesAPI.saveNote(baseFormRef.current?.getFieldsValue());
            setModalVisiable(false);
            message.success("新增成功");
            props.refreshTable();
        }
    };

    return (
        <Modal
            title={
                props.type === "add" ? "新建笔记" : props.type === "edit" ? "编辑笔记" : "查看笔记"
            }
            open={modalVisiable}
            onCancel={() => setModalVisiable(false)}
            afterClose={() => props.closeModal()}
            footer={
                props.type === "check"
                    ? null
                    : [
                          <Button key="cancel" onClick={() => setModalVisiable(false)}>
                              取消
                          </Button>,
                          <Button key="save" type="primary" onClick={save}>
                              保存
                          </Button>,
                      ]
            }
        >
            <div className="app-form">
                <Form
                    ref={baseFormRef}
                    initialValues={{ ...props.curRow }}
                    disabled={props.type === "check"}
                >
                    <Form.Item label="标题" name="title">
                        <Input placeholder="笔记标题" />
                    </Form.Item>

                    <Form.Item label="内容" name="body">
                        <TextArea rows={4} placeholder="开始记录..." />
                    </Form.Item>
                </Form>
            </div>
        </Modal>
    );
}

export default ReactNoteModal;
