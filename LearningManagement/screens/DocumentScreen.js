import React, { Component } from 'react'
import { Text, View, TouchableOpacity, FlatList, StyleSheet, Dimensions, Image, TextInput,RefreshControl } from 'react-native'
import * as theme from '../constants/Theme'
import { getDocumentAsync } from 'expo-document-picker'
import * as Openanything from 'react-native-openanything';
import { connect } from 'react-redux'
import { listDocument } from '../redux/action'
import { FontAwesome } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { Header } from 'react-native-elements'
import Modal from "react-native-modal";
import { addDocument } from '../constants/Api'
import Loading from '../components/Loading'
import Empty from '../components/Empty'
let { width } = Dimensions.get('window');

const obj = {
  // type: 'application/pdf',
  type: '*/*',
  copyToCacheDirectory: false,
  multiple: false
}

export class DocumentScreen extends Component {
  constructor(props) {
    super(props)
    const { navigation, eventState } = this.props
    this.state = {
      isLoading: false,
      err: null,
      isModalVisible: false,
      tilte: "",
      filename: "",
      payload: null,
      singleFile: null
    }
  }
  async openDocument() {
    try {
      const file = await getDocumentAsync(obj);
      if (file.type === 'success') {
        console.log(file)
        // const data = new FormData();
        // data.append('tilte', 'Image Upload');
        // data.append('file', file);
        this.setState({
          ...this.state,
          filename: file.name,
          // payload: data,
          singleFile: file
        })
      }
      // let result = await ImagePicker.launchImageLibraryAsync({
      //   mediaTypes: ImagePicker.MediaTypeOptions.All,
      //   aspect: [4, 3],
      //   quality: 1,
      // });
      // this.setState({
      //   ...this.state,
      //   filename: result.uri,
      //   // payload: data,
      //   singleFile: result
      // })


    } catch (err) {
      // Expo didn't build with iCloud, expo turtle fallback
      // this.webview.injectJavaScript('selectFile()');
      console.log(err);
    }
  }

  // uploadFile = async (data) => {
  //   console.log(data)
  //   try {
  //     const result = await addDocument(data)
  //     if (result) {
  //       this.setState({
  //         ...this.state,
  //         data: result.data
  //       }, () => this.props.listDocument())
  //     }
  //   } catch (error) {
  //     this.setState({
  //       ...this.state,
  //       error: error
  //     })
  //     console.log(error)
  //   }
  // }

  uploadImage = async () => {
    if (this.state.singleFile != null) {
      const fileToUpload = this.state.singleFile;
      const data = new FormData();
      data.append('tilte', 'Image Upload');
      data.append('file', fileToUpload);
      let res = await fetch(
        'http://192.168.1.3:3000/document/add',
        {
          method: 'post',
          body: data,
          headers: {
            'Content-Type': 'multipart/form-data; ',
          },
        }
      );
      let responseJson = await res.json();
      if (responseJson.status == 1) {
        alert('Upload Successful');
      }
    } else {
      alert('Please Select File first');
    }
  };

  handleModal() {
    this.setState({
      isModalVisible: !this.state.isModalVisible
    });
  }

  componentDidMount() {
    this.props.listDocument()
  }

  renderModal() {
    return (
      <Modal
        style={{ justifyContent: "center", margin: 0, alignItems: "center" }}
        hasBackdrop={true}
        onBackdropPress={() => this.handleModal()}
        isVisible={this.state.isModalVisible}
      >
        <View
          style={{
            width: "90%",
            borderRadius: 10,
            backgroundColor: 'white',
            padding: 10
          }}
        >
          <Text style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: theme.colors.schedule,
            padding: 5,
            borderBottomWidth: 0.5,
            borderBottomColor: theme.colors.schedule
          }}>THÊM TÀI LIỆU</Text>
          <View style={{
            alignItems: 'center',
            height: 150,
          }}>
            <View style={styles.content}>
              <Text style={{ fontSize: 16 }}>
                Tên tài liệu :
                    </Text>
              <TextInput
                style={{
                  marginTop: 20,
                  height: 40,
                  marginVertical: 10,
                  flex: 1,
                  fontSize: 18,
                  paddingHorizontal: 15,
                  marginLeft: 5,
                  textAlign: 'right',
                  backgroundColor: theme.colors.border,
                }}
                value={this.state.tilte}
                onChangeText={text => {
                  this.setState({
                    ...this.state,
                    tilte: text
                  })
                }}
              />
            </View>
            <View style={styles.content}>
              <Text style={{ fontSize: 16 }}>
                Đường dẫn file :
                    </Text>
              <View
                style={{
                  marginTop: 20,
                  height: 40,
                  marginVertical: 10,
                  flex: 1,
                  fontSize: 18,
                  paddingHorizontal: 15,
                  marginLeft: 5,
                  textAlign: 'right',
                  justifyContent: 'center',
                  backgroundColor: theme.colors.border,
                }}>
                <Text style={{ fontSize: 16 }} numberOfLines={1}>{this.state.filename}</Text>
              </View>
              <TouchableOpacity style={{
                width: 40,
                height: 40,
                backgroundColor: theme.colors.schedule,
                marginLeft: 5,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 5,
                marginTop: 8
              }}
                onPress={() => this.openDocument()}>
                <Entypo name="documents" size={30} color="white" />
              </TouchableOpacity>
            </View>

          </View>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 15,
          }}>
            <TouchableOpacity style={{
              width: 120, height: 40,
              borderRadius: 25,
              backgroundColor: theme.colors.schedule,
              alignItems: 'center',
              justifyContent: 'center',
            }}
              onPress={() => {
                // this.uploadImage();
                this.handleModal()
              }
              }>
              <Text style={{ fontWeight: 'bold', color: 'white' }}>ĐỒNG Ý</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }


  render() {
    const { navigation, document } = this.props
    return (
      <View style={{ flex: 1 }}>
        <Header
          placement='left'
          backgroundColor={theme.colors.schedule}
          leftComponent={
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <MaterialIcons name="menu" size={28} color="white" />
            </TouchableOpacity>
          }
          centerComponent={
            <Text style={styles.text_head}>Tài liệu</Text>
          }
          rightComponent={
            <TouchableOpacity onPress={() => { this.handleModal() }}>
              <FontAwesome5 name="plus" size={24} color="white" />
            </TouchableOpacity>
          }
        />
        {this.renderModal()}
        {this.renderBody()}
      </View>
    )
  }

  renderBody() {
    const { navigation, document } = this.props
    if (document.isLoading) return <Loading />
    if (document.data.length == 0) return <Empty />
    return (
      <FlatList
        data={document.data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={(this.renderItem)}
        refreshControl={
          <RefreshControl
            refreshing={document.isLoading}
            onRefresh={() => this.props.listDocument()}
          />
        }
      />
    )
  }

  renderItem = ({ item, index }) => {
    let date = item.updatedAt.toString()
    return (
      <TouchableOpacity style={styles.bgItem}
        onPress={() => Openanything.Pdf(item.url)}>
        <Image source={{ uri: 'https://www.thietkemyb.com.vn/wp-content/uploads/2020/10/pdf.png' }}
          style={{ width: 80, alignItems: 'center', justifyContent: 'center', borderWidth: 0.5, height: 80 }} f />
        <View style={{ padding: 5, width: width * 9 / 10 - 90 }}>
          <Text style={{ fontSize: 16, marginLeft: 5, fontWeight: 'bold', color: theme.colors.schedule, marginVertical: 5 }}>
            {item.tilte}
          </Text>
          <View style={{ marginVertical: 10, alignSelf: 'flex-end', flexDirection: 'row' }}>
            <Text style={{ marginLeft: 10, fontStyle: 'italic', marginRight: 40 }}>
              Tải lên : {date.substring(8, 10)}-{date.substring(5, 7)}-{date.substring(0, 4)}
            </Text>
            <TouchableOpacity style={[styles.button, { borderColor: theme.colors.red }]}>
              <FontAwesome name="trash-o" size={20} color={theme.colors.red} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const mapStateToProps = (state) => ({
  document: state.documentReducer,
})

const mapDispatchToProps = {
  listDocument
}

export default connect(mapStateToProps, mapDispatchToProps)(DocumentScreen)

const styles = StyleSheet.create({
  text_head: {
    fontSize: 20,
    color: theme.colors.white,
    fontWeight: 'bold'
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    justifyContent: 'center'
  },
  bgItem: {
    marginTop: 5,
    width: '96%',
    marginHorizontal: '2%',
    borderRadius: 5,
    backgroundColor: theme.colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: 50,
    height: 30,
    borderWidth: 0.5,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
})


// import React, { useState, useEffect } from 'react';
// import { Button, Image, View, Platform , Text} from 'react-native';
// import * as ImagePicker from 'expo-image-picker';

// export default function ImagePickerExample() {
//   const [image, setImage] = useState(null);

//   useEffect(() => {
//     (async () => {
//       if (Platform.OS !== 'web') {
//         const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//         if (status !== 'granted') {
//           alert('Sorry, we need camera roll permissions to make this work!');
//         }
//       }
//     })();
//   }, []);

//   const pickImage = async () => {
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.All,
//       aspect: [4, 3],
//       quality: 1,
//     });

//     console.log(result);

//     if (!result.cancelled) {
//       setImage(result.uri);
//     }
//   };

//   return (
//     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//       <Button title="Pick an image from camera roll" onPress={pickImage} />
//       <Text>{image}</Text>
//       {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
//     </View>
//   );
// }
