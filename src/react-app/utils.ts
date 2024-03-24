import { Builder } from "xml2js";
import { Note } from "./types";

// 导出
export const exportXML = (data: Note[]) => {
    const builder = new Builder();
    const xml = builder.buildObject({ root: { data } });
    const blob = new Blob([xml], { type: "application/xml" });
    return URL.createObjectURL(blob);
};
