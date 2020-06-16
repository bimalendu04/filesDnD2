import React, { Component } from 'react';
import styles from './styles.module.scss';
import { FilePdfTwoTone, FileJpgOutlined, FileImageTwoTone, VideoCameraTwoTone, FileTwoTone } from '@ant-design/icons';
import { Popover, Drawer } from 'antd';
import moment from 'moment';

const colorCode = '#900C3F';

export default class FileView extends Component {
    state = {
        viewInfo: false
    };

    content = (
        <div>
            <p style={{ cursor: 'pointer' }} onClick={() => this.download(this.props.data.binaryStr, this.props.data.typeOfFile)}>View</p>
            {/* <a href={this.props.data.binaryStr}>View</a> */}
            <p style={{ cursor: 'pointer' }} onClick={() => this.setState({ viewInfo: true })}>View Details</p>
        </div>
    );



    download = (arrayBuffer, type) => {
        const byteCharacters = atob(arrayBuffer.split(',')[1]);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        var blob = new Blob([byteArray], { type: type });
        var url = URL.createObjectURL(blob);
        window.open(url);
    };

    formatBytes = (bytes, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    getIcon = () => {
        const { data } = this.props;
        const fileType = data.name.split('.')[data.name.split('.').length - 1];

        switch (fileType) {
            case 'pdf':
                return <FilePdfTwoTone twoToneColor={colorCode} />;

            case 'jpg':
                return <FileImageTwoTone twoToneColor={colorCode} />;

            case 'jpeg':
                // return <FileJpgOutlined />;
                return <FileImageTwoTone twoToneColor={colorCode} />;

            case 'png':
                return <FileImageTwoTone twoToneColor={colorCode} />;

            case 'mp4':
                return <VideoCameraTwoTone twoToneColor={colorCode} />;

            default:
                return <FileTwoTone twoToneColor={colorCode} />;
        }
    };

    render() {
        const { data } = this.props;
        return <div className={styles.fileView}>
            <Popover content={this.content} trigger="click" >
                <div style={{
                    cursor: 'pointer',
                    display: 'inline-block',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%'
                }}>
                    <div style={{ fontSize: 50 }}>{this.getIcon()}</div>
                    <div style={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        padding: '0 5px'
                    }}>{data.name}</div>
                </div>
            </Popover>
            <Drawer
                title={data.name}
                placement="right"
                closable={false}
                onClose={() => this.setState({ viewInfo: false })}
                visible={this.state.viewInfo}
            >
                <div>Last Modified: {moment(data.lastModified).format('DD-MM-YYYY')}</div>
                <div>Size: {this.formatBytes(data.size)}</div>
            </Drawer>
        </div>
    }
}