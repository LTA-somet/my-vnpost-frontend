import React, { Component } from 'react';
import { Upload, Modal, Button } from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

class PicturesWall extends Component {
  state = {
    previewVisible: false,
    previewImage: '',
    previewTitle: '',
    fileList: this.props.rowData?.image
      ? [
          {
            // previewImage: this.props.rowData?.image,
            // thumbUrl : this.props.rowData?.image,
            // previewVisible: this.props.rowData?.image == null || this.props.rowData?.image == undefined  ? true : false,
            name: 'image.png',
            status: 'done',
            url: this.props.rowData?.image,
            preview: this.props.rowData?.image,
            uid: this.props.rowData?.stepDetailId,
          },
        ]
      : [],
  };
  componentDidUpdate(prevProps) {
    if (this.props.rowData?.image !== prevProps.rowData?.image) {
      console.log('img', this.props.rowData);
      let fileList = [];
      (fileList = this.props.rowData?.image
        ? [
            {
              name: 'image.png',
              status: 'done',
              url: this.props.rowData?.image,
              preview: this.props.rowData?.image,
              uid: this.props.rowData?.stepDetailId,
            },
          ]
        : []),
        console.log('fileList', fileList);
      this.setState({ fileList });
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

    // this.setState({
    //   // previewImage: file.url || file.preview,
    //   previewVisible: false,
    //   // previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    // });
  };

  handleChange = async ({ fileList }) => {
    // console.log("handleChange", fileList);
    if (fileList.length > 0) {
      let file = fileList[0];
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      console.log('file.preview 123: ', file.preview);
      let data = {
        key: this.props.rowData?.stepDetailId,
        image: file.preview,
      };
      this.props.upLoadImage(data);
    } else {
      let data = {
        key: this.props.rowData?.stepDetailId,
        image: '',
      };
      this.props.upLoadImage(data);
    }
    this.setState({ fileList });
  };
  render() {
    const { previewVisible, previewImage, fileList, previewTitle } = this.state;
    // console.log('rowData: ', this.props.rowData);
    const uploadButton = (
      <div>
        {/* <PlusOutlined /> */}
        {/* <div style={{ marginTop: 8 }}>Upload</div> */}
        {/* <UploadOutlined /> <div>Upload</div> */}
        <Button
          disabled={this.props.rowData?.isOwner == false ? true : false}
          // className="btn-upload"
          className={this.props.rowData?.productId ? 'btn-default-upload' : 'btn-upload'}
          icon={<UploadOutlined></UploadOutlined>}
        >
          {' '}
          Upload{' '}
        </Button>
      </div>
    );
    return (
      <>
        <Upload
          // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          // disabled={this.props.rowData?.isOwner == false ? true : false}
        >
          {fileList.length >= 1 ? null : uploadButton}
        </Upload>

        <Modal
          width="50%"
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

export default PicturesWall;
