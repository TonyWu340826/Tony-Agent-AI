package com.tony.service.tonywuai.utils;

// 为了 Jackson 或 Gson 能够将 JSON 元素映射为 Java 对象而定义的类
class ParamSchemaItem {
    public String name;
    public String label;
    public String type;
    public String note;

    public ParamSchemaItem() {
    }

    public ParamSchemaItem(String name, String note, String type, String label) {
        this.name = name;
        this.note = note;
        this.type = type;
        this.label = label;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}