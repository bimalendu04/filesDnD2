import React, {Component} from 'react';
// import FolderView from '../folderView';
import Dropzone from 'react-dropzone';
// import './style.less';

export default class Home extends Component {
  constructor(props) {
    super(props);
    let data = {};
    this.state = {
      data: data,
      currentOpenedFolder: data.key
    };
    this.folderTemplate = {
      key: this.createRandomKey(),
      type: 'FOLDER',
      name: '',
      contents: []
    };

    this.fileTemplate = {
      key: this.createRandomKey(),
      type: 'FILE',
      name: '',
      fileDetails: {}
    };
  }


  onDrop = (acceptedFiles) => {
    console.log(acceptedFiles);
    acceptedFiles.forEach((file) => {

      const reader = new FileReader()
      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = () => {
      // Do whatever you want with the file contents
        const binaryStr = reader.result
        console.log(binaryStr);
        this.Download(binaryStr, file.type);
      }
      reader.readAsArrayBuffer(file)
    })
  }

  Download=(arrayBuffer, type) =>  {
    var blob = new Blob([arrayBuffer], { type: type });
    var url = URL.createObjectURL(blob);
    window.open(url);
  }

  createRandomKey = () => {
    return parseInt(Math.random() * 1000);
  }

  onError = (e) => {
    console.log(e, 'error in file-viewer');
  }

  render() {

    return <div className='container'>
    <Dropzone multiple={true} onDrop={acceptedFiles => this.onDrop(acceptedFiles)}>
    {({getRootProps, getInputProps, isDragActive }) => (
      <section>
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          {
            isDragActive ? 
            <p>Drop files here</p> :
            <p>Drag 'n' drop some files here, or click to select files</p>
          }
          xe
        </div>
      </section>
    )}
  </Dropzone>
  </div>
  
  }
}