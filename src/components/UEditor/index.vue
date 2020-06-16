<template>
    <div class="uedit">
        <!-- 图片上传组件辅助 -->

        <!-- 富文本组件 -->
        <!-- <quill-editor class="editor" v-model="content" ref="quillEditor" :options="editorOption" @blur="onEditorBlur($event)" @focus="onEditorFocus($event)" @change="onEditorChange($event)"></quill-editor> -->
        <script id="editor" name="content" style="width:100%;height:300px;" type="text/plain">
            {{content}}
    </script>
    </div>
</template>

<script>
export default {
    props: {
        /* 编辑器的内容 */
        value: {
            type: String
        },
        /* 图片大小 */
        maxSize: {
            type: Number,
            default: 4000 //kb
        }
    },

    data() {
        return {
            content: "",
            current_editor: null
        };
    },
    watch: {
        value: function() {
            if (current_editor) {
                this.content = this.value;
                current_editor && current_editor.setContent(this.value);
            }
        }
    },
    computed: {},
    destroyed() {
        current_editor = null;
        UE.delEditor("editor");
    },
    mounted() {
        window.UEDITOR_HOME_URL = "/UE/";
        current_editor = UE.getEditor("editor", {
            initialFrameHeight: 600,
            focus: true,
            toolbars: [
                [
                    "bold",
                    "italic",
                    "underline",
                    "fontborder",
                    "strikethrough",
                    "135editor",
                    "rowspacingtop",
                    "rowspacingbottom",
                    "lineheight",
                    "removeformat",
                    "formatmatch",
                    "autotypeset",
                    "blockquote",
                    "pasteplain",
                    "|",
                    "forecolor",
                    "backcolor",
                    "insertorderedlist",
                    "insertunorderedlist",
                    "selectall",
                    "cleardoc",
                    "|",
                    "superscript",
                    "subscript"
                ]
            ],
            focusInEnd: true
        });
        current_editor.addListener("contentChange", this.onEditorChange);
    },
    methods: {
        handleUpload(params) {
            const file = params.file;
            var fileName =
                "/notice/" + (Date.parse(new Date()) + Math.random() * 999);
            var suffix = this.get_suffix(file.name);
            this.client
                .put(fileName + suffix, file)
                .then(res => {
                    // 获取富文本组件实例
                    let quill = this.$refs.quillEditor.quill;
                    // 获取光标所在位置
                    let length = quill.getSelection().index;
                    // 插入图片  res.url为服务器返回的图片地址
                    quill.insertEmbed(length, "image", res.url);
                    // 调整光标到最后
                    quill.setSelection(length + 1);
                })
                .catch(e => {
                    this.$message.error("图片插入失败");
                });
        },
        get_suffix(filename) {
            var pos = filename.lastIndexOf(".");
            var suffix = "";
            if (pos != -1) {
                suffix = filename.substring(pos);
            }
            return suffix;
        },
        onEditorBlur(event) {
            //失去焦点事件
        },
        onEditorFocus() {
            //获得焦点事件
        },
        onEditorChange() {
            if (current_editor)
                //内容改变事件
                this.$emit("input", current_editor.getContent());
        },

        // 富文本图片上传前
        quillImgBefore(file) {
            let fileType = file.type;
            if (fileType === "image/jpeg" || fileType === "image/png") {
                return true;
            } else {
                this.$message.error("请插入图片类型文件(jpg/jpeg/png)");
                return false;
            }
        },

        quillImgSuccess(res, file) {
            // res为图片服务器返回的数据
            // 获取富文本组件实例
            let quill = this.$refs.quillEditor.quill;
            // 如果上传成功
            if (res.code == 200) {
                // 获取光标所在位置
                let length = quill.getSelection().index;
                // 插入图片  res.url为服务器返回的图片地址
                quill.insertEmbed(length, "image", res.url);
                // 调整光标到最后
                quill.setSelection(length + 1);
            } else {
                this.$message.error("图片插入失败");
            }
        },
        // 富文本图片上传失败
        uploadError() {
            // loading动画消失
            this.$message.error("图片插入失败");
        }
    }
};
</script>

<style >
.edui-button.edui-for-135editor .edui-button-wrap .edui-button-body .edui-icon {
    background-image: url("http://static.135editor.com/img/icons/editor-135-icon.png") !important;

    background-size: 85%;

    background-position: center;

    background-repeat: no-repeat;
}
</style>
