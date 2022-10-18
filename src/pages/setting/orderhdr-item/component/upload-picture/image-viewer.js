import React, { Component } from 'react';
import { Upload, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

class ImageView extends Component {
  state = {
    previewVisible: false,
    previewImage: '',
    previewTitle: '',
    fileList: [
      // {
      //   uid: '-1',
      //   name: 'image.png',
      //   status: 'done',
      //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      // },
    ],
  };

  componentDidUpdate(prevProps) {
    if (this.props.data !== prevProps.data) {
      let newData = this.props.data;
      // let fileList = this.state.fileList;
      let fileList = [];
      newData.forEach((element, index) => {
        let file = {
          name: 'image.png',
          status: 'done',
          url: element.dataImg ? element.dataImg.replace("data:application/octet-stream;base64", "data:image/jpeg;base64") : null,
          preview: element.dataImg ? element.dataImg.replace("data:application/octet-stream;base64", "data:image/jpeg;base64") : null,
          uid: index,
        };
        fileList.push(file);
      });
      //   this.props.handleChangeData(fileList);
      this.setState({ fileList });
      console.log('newDataImage', newData);
    }
  }

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };

  render() {
    const { previewVisible, previewImage, fileList, previewTitle } = this.state;
    console.log('state : ', this.state, this.props.data);
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
    return (
      <>
        <Upload
          listType="picture-card"
          preview={{ visible: false }}
          fileList={fileList}
          onPreview={this.handlePreview}
          disabled={true}
        //   onChange={this.handleChange}
        >
          {/* {fileList.length >= 5 ? null : uploadButton} */}
        </Upload>
        <Modal
          width="88%"
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </>
    );
  }
}

export default ImageView;
