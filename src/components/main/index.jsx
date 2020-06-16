import React from "react";
import Dropzone from 'react-dropzone';
import styles from './styles.module.scss';
import _ from 'lodash';
import FolderView from '../folderView';
import FileView from '../fileView';
import { Modal, Button, Input, Layout, Row, Col } from 'antd';
import { FolderAddOutlined, ArrowLeftOutlined } from '@ant-design/icons';

const { Content } = Layout;

const allFiles = [];

export const itemTypes = {
	Folder: 'FOLDER',
	File: 'FILE'
}

class File extends React.Component {
	localStorageData = this.getLocalStorageData();
	state = {
		allFiles: this.localStorageData || allFiles,
		currentView: this.localStorageData || allFiles,
		currentKey: null
	};

	folderTemplate = {
		key: '',
		type: 'FOLDER',
		name: '',
		contents: []
	};

	fileTemplate = {
		key: '',
		type: 'FILE',
		name: '',
		fileDetails: {},
		binaryStr: null
	};

	getLocalStorageData() {
		try {
			return JSON.parse(window.localStorage.getItem('allFiles'));
		} catch (e) {
			return null;
		}
	}

	goToFolder = file => {
		this.setState({
			currentView: file.contents,
			currentKey: file.key
		});
	};

	showCurrentView = () => {
		if (!this.state.currentView) {
			return null;
		}
		return this.state.currentView.map((file, index) => {
			// <button onClick={() => this.goToFolder(file)}>{file.name}</button>
			if (file.type === itemTypes.Folder) {
				return <FolderView data={file} openFolder={(file) => this.goToFolder(file)} />
			} else {
				return <FileView data={file} />
			}
		});
	};

	pushIntoAllFiles = (currentKey, newFile) => {
		const { allFiles } = this.state;
		if (!currentKey) {
			allFiles.push(newFile);
			return allFiles;
		}
		this.findKeyAndPush(allFiles, currentKey, newFile);
		return allFiles;
	};

	findKeyAndPush = (fileArr, currentKey, newFile) => {
		fileArr.forEach(file => {
			if (file.key === currentKey) {
				file.contents.push(newFile);
			} else if (file.contents) {
				this.findKeyAndPush(file.contents, currentKey, newFile);
			}
		});
	};

	addFolder = () => {
		const { currentView, currentKey } = this.state;
		let newFile = _.cloneDeep(this.folderTemplate);
		newFile.key = !currentKey
			? `${currentView.length}`
			: `${currentKey}-${currentView.length}`;
		newFile.name = this.state.folderName;
		let allFiles = this.pushIntoAllFiles(currentKey, newFile);
		this.setState({
			allFiles
		}, () => {
			window.localStorage.setItem('allFiles', JSON.stringify(this.state.allFiles));
			this.closeFolderNameModal()
		});
	};

	openFolderNameModal = () => {
		this.setState({
			openFolderNameModal: true
		})
	};

	closeFolderNameModal = () => {
		this.setState({
			openFolderNameModal: false,
			folderName: ''
		})
	};

	updateName = (event) => {
		event.preventDefault();
		this.setState({
			folderName: event.target.value
		})
	};

	onDrop = (acceptedFiles) => {
		// console.log(acceptedFiles);
		acceptedFiles.forEach((file) => {
			const reader = new FileReader()
			reader.readAsDataURL(file);
			reader.onabort = () => console.log('file reading was aborted')
			reader.onerror = () => console.log('file reading has failed')
			reader.onload = () => {
				// Do whatever you want with the file contents
				const binaryStr = reader.result
				// console.log(binaryStr);
				this.addFile(file, binaryStr);
			}
			// reader.readAsArrayBuffer(file);
		})
	}

	addFile = (file, binaryStr) => {
		const { currentView, currentKey } = this.state;
		let newFile = _.cloneDeep(this.fileTemplate);
		newFile.key = !currentKey
			? `${currentView.length}`
			: `${currentKey}-${currentView.length}`;
		newFile.name = file.name;
		newFile.path = file.path;
		newFile.typeOfFile = file.type;
		newFile.lastModified = file.lastModified;
		newFile.size = file.size;
		newFile.fileDetails = file;
		newFile.binaryStr = binaryStr;
		let allFiles = this.pushIntoAllFiles(currentKey, newFile);
		this.setState({
			allFiles
		}, () => {
			window.localStorage.setItem('allFiles', JSON.stringify(this.state.allFiles));
			this.closeFolderNameModal()
		});
	};

	goToParentFolder = () => {
		const { currentKey, allFiles } = this.state;

		let tempcurrentKeyArr = currentKey.split('-').slice(0, currentKey ? currentKey.split('-').length - 1 : 0);
		let currentView;
		let currentKeyTemp = tempcurrentKeyArr.length ? currentKey : null;
		if (tempcurrentKeyArr && tempcurrentKeyArr.length) {
			tempcurrentKeyArr.forEach((data, index) => {
				if (index === 0) {
					currentView = allFiles[data];
				}
				else {
					currentView = currentView.contents[data];
				}
			});
		}
		this.setState({
			currentView: currentKeyTemp === null ? allFiles : currentView.contents,
			currentKey: currentKeyTemp === null ? null : currentView.key
		})
	};

	render() {
		return (
			<Layout>
				<Content>
					<Row>
						<Col span={24}>
							<div className={styles.container}>
								<Row>
									<Col span={24}>
										<Button
											style={{ marginBottom: 10 }}
											onClick={() => this.openFolderNameModal()}
											type="primary"
											shape="round"
											icon={<FolderAddOutlined style={{ fontSize: 21 }} />} size={'large'}>
											Create Folder
							</Button>
									</Col>
									<Col span={24}>
										<Row>
											<Col span={24}>
												<span onClick={() => this.state.currentKey ? this.goToParentFolder() : ''}><ArrowLeftOutlined style={{ fontSize: 21, cursor: this.state.currentKey ? 'pointer' : 'normal' }} /></span>
											</Col>
											<Col span={24}>
												<Dropzone
													noClick={true}
													accept={['audio/*', 'video/*', 'image/*', '.pdf', 'text/plain']}
													onDrop={acceptedFiles => this.onDrop(acceptedFiles)}
												>
													{({ getRootProps, getInputProps, isDragActive }) => (
														<section className={styles.section}>
															<div className={styles.viewContainer} {...getRootProps()}>
																<input {...getInputProps()} />
																{this.showCurrentView()}
																{
																	isDragActive ?
																		<p>Drop files here</p> :
																		<p>Drag 'n' drop some files here</p>
																}
															</div>
														</section>
													)}
												</Dropzone>
											</Col>
										</Row>
									</Col>
								</Row>
								<Modal
									visible={this.state.openFolderNameModal}
									title="Folder name"
									onOk={() => this.closeFolderNameModal()}
									onCancel={() => this.closeFolderNameModal()}
									footer={[
										<Button key="back" onClick={this.closeFolderNameModal}>
											Cancel
              </Button>,
										<Button key="submit" type="primary" disabled={!this.state.folderName} onClick={this.addFolder}>
											Create
              </Button>,
									]}
								>
									<Input placeholder="Folder name" value={this.state.folderName} onChange={(e) => this.updateName(e)} />
								</Modal>
							</div>
						</Col>
					</Row>
				</Content>
			</Layout>

		);
	}
}

export default File;
