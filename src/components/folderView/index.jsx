import React,{Component} from 'react';
import styles from './styles.module.scss';
import {FolderOpenTwoTone } from '@ant-design/icons';

const colorCode='#C70039';

export default class FolderView extends Component {
    render() {
        return <div className={styles.folderView} onDoubleClick={() => this.props.openFolder(this.props.data)}>
            <FolderOpenTwoTone twoToneColor={colorCode} />
            <div className={styles.title}>{this.props.data.name}</div>
        </div>
    }
}