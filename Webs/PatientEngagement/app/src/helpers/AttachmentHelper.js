/* istanbul ignore file */
import {Platform, ActionSheetIOS, Alert} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import moment from 'moment';
import {allowedFiles} from '../helpers/Common';
import * as ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
type Captions = {
  image: string,
  document: string,
  cancel: string,
  title: string,
};

export class AttachmentHelper {
  constructor(
    captions: Captions = {
      camera: 'Camera',
      image: 'Image',
      document: 'Document',
      cancel: 'Cancel',
      title: 'Pick type of media',
    },
  ) {
    this._captions = captions;
  }

  // Variables

  // Singleton Class
  static _instance: AttachmentHelper = null;
  static sharedInstance() {
    if (this._instance === null) {
      this._instance = new AttachmentHelper();
    }
    return this._instance;
  }

  pick = () => {
    if (Platform.OS === 'ios') {
      return this._pickIOS();
    }

    return new Promise((resolve, reject) => {
      return this._pickDocument(resolve, reject);
    });
  };
  _pickIOS = () => {
    return new Promise((resolve, reject) => {
      const {image, document, cancel, title, camera} = this._captions;
      const options = [camera, image, document, cancel];
      const handlers = [
        this._pickCamera,
        this._pickImage,
        // this._pickDocument,
        this._pickClosed,
      ];
      const cancelButtonIndex = options.indexOf(cancel);

      ActionSheetIOS.showActionSheetWithOptions(
        {options, cancelButtonIndex, title},
        buttonIndex => {
          handlers[buttonIndex](resolve, reject);
        },
      );
    });
  };

  _pickCamera = (
    resolve: (payload: any) => void,
    reject: (payload: any) => void,
  ) => {
    console.log('open camera');
    let options = {
      mediaType: 'photo',
      includeBase64: false,
      maxWidth: 300,
      maxHeight: 400,
      cropping: true,
      cameraType: 'back',
    };
    ImagePicker.launchCamera(options).then(result => {
      console.log(' camera result');
      console.log(result);
      if (result.didCancel) {
        reject(new Error('Action cancelled!'));
      } else {
        let image = result.assets[0];
        ImageResizer.createResizedImage(image.uri, 180, 180, 'JPEG', 100)
          .then(({uri}) => {
            console.log('resizee image');
            console.log(uri);
            image.uri = uri;
            if (image) {
              let imageData = {};
              imageData.uri = image.uri;
              imageData.name = image.fileName;
              imageData.type = image.type;
              imageData.size = image.fileSize;
              console.log(imageData);
              resolve(imageData);
            }
          })
          .catch(err => {
            console.log(err);
            return Alert.alert(
              'Unable to resize the photo',
              'Check the console for full the error message',
            );
          });
      }
    });
  };

  _pickImage = (
    resolve: (payload: any) => void,
    reject: (payload: any) => void,
  ) => {
    let options = {
      mediaType: 'photo',
      includeBase64: false,
    };
    ImagePicker.launchImageLibrary(options)
      .then(response => {
        setTimeout(() => {
          if (response.didCancel) {
            reject(new Error('Action cancelled!'));
          } else {
            console.log('ios image response');
            console.log(response);
            var FileSize = response.assets[0].fileSize / 1024 / 1024; // in MB
            console.log('fileSize');
            console.log(FileSize);
            if (FileSize > 5) {
              Alert.alert('Error', 'Maximum 5MB file size is allowed ');
            } else {
              const fileType = response.assets[0].type;
              const fileExtension = fileType.substr(fileType.indexOf('/') + 1);
              console.log('fileExtension');
              console.log(fileExtension);
              var index = allowedFiles.indexOf(fileExtension);
              if (index !== -1) {
                let finalResult = response.assets[0];
                let imageData = {};
                imageData.uri = finalResult.uri;
                imageData.name = finalResult.fileName;
                imageData.type = finalResult.type;
                imageData.size = finalResult.fileSize;
                console.log(imageData);
                resolve(imageData);
              } else {
                Alert.alert(
                  'Error',
                  'File is not supported by 360 Care Manger',
                );
              }
            }
          }
        }, 200);
      })
      .catch(error => {
        console.log('mage picker error');
        console.log(error);
      });
  };

  // _pickImage = (
  //   resolve: (payload: any) => void,
  //   reject: (payload: any) => void,
  // ) => {
  //   ImagePicker.launchImageLibrary({
  //     multiple: false,
  //     mediaType: 'photo',
  //   }).then(images => {
  //     console.log('images');
  //     console.log(images);
  //     ImageResizer.createResizedImage(
  //       images.assets[0].uri,
  //       180,
  //       180,
  //       'JPEG',
  //       100,
  //     )
  //       .then(({uri}) => {
  //         console.log('====================================');
  //         console.log('uri resize', uri);
  //         console.log('====================================');
  //         images.path = uri;
  //         resolve(images);
  //       })
  //       .catch(err => {
  //         console.log(err);
  //         return Alert.alert(
  //           'Unable to resize the photo',
  //           'Check the console for full the error message',
  //         );
  //       });
  //   });
  //   // let options = {
  //   //   mediaType: 'photo',
  //   //   includeBase64: false,
  //   // };
  //   // ImagePicker.launchImageLibrary(options)
  //   //     .then(response => {
  //   //       setTimeout(() => {
  //   //         if (response.didCancel) {
  //   //           reject(new Error('Action cancelled!'));
  //   //         } else {
  //   //           console.log('ios image response');
  //   //           console.log(response);
  //   //           var FileSize = response.assets[0].fileSize / 1024 / 1024; // in MB
  //   //           console.log('fileSize');
  //   //           console.log(FileSize);
  //   //           if (FileSize > 5) {
  //   //             Alert.alert('Error', 'Maximum 5MB file size is allowed ');
  //   //           } else {
  //   //             const fileType = response.assets[0].type;
  //   //             const fileExtension = fileType.substr(fileType.indexOf('/') + 1);
  //   //             console.log('fileExtension');
  //   //             console.log(fileExtension);
  //   //             var index = allowedFiles.indexOf(fileExtension);
  //   //             if (index !== -1) {
  //   //               let finalResult = response.assets[0];
  //   //               let imageData = {};
  //   //               imageData.uri = finalResult.uri;
  //   //               imageData.name = finalResult.fileName;
  //   //               imageData.type = finalResult.type;
  //   //               imageData.size = finalResult.fileSize;
  //   //               console.log(imageData);
  //   //               resolve(imageData);
  //   //             } else {
  //   //               Alert.alert(
  //   //                   'Error',
  //   //                   'File is not supported by 360 Care Manger',
  //   //               );
  //   //             }
  //   //           }
  //   //         }
  //   //       }, 200);
  //   //     })
  //   //     .catch(error => {
  //   //       console.log('mage picker error');
  //   //       console.log(error);
  //   //     });
  // };

  _pickDocument = async (
    resolve: (payload: any) => void,
    reject: (payload: any) => void,
  ) => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      console.log('ios/android dacument response');
      console.log(result);
      var FileSize = result[0].size / 1024 / 1024; // in MB
      console.log('fileSize');
      console.log(FileSize);
      if (FileSize > 5) {
        Alert.alert('Error', 'Maximum 5MB file size is allowed ');
      } else {
        const fileType = result[0].type;
        const fileExtension = fileType.substr(fileType.indexOf('/') + 1);
        var index = allowedFiles.indexOf(fileExtension);
        if (index !== -1) {
          let finalResult = result[0];
          resolve(finalResult);
        } else {
          Alert.alert(
            'Error',
            'File is not supported by 360 PatientEngagement',
          );
        }
      }
    } catch {
      reject(new Error('Action cancelled!'));
    }
  };

  _pickClosed = (_: any, reject: (payload: any) => void) => {
    reject(new Error('Action cancelled!'));
  };
}
